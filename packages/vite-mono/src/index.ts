import path from 'node:path';
import fg from 'fast-glob';
import fs from 'node:fs';
import { build, loadConfigFromFile, UserConfig } from 'vite';
import Logger from './logger';
import { loadPackageJSON, type PackageJSON } from './package';
/**
 * Synchronously read a package.json for a given directory. Returns an empty object
 * when the package.json cannot be loaded so callers can treat it as optional.
 */
function readPackageJSON(dir: string): PackageJSON {
	return loadPackageJSON(dir) ?? ({} as PackageJSON);
}

interface ViteMonoConfig {
	root: string;
}

async function workspaceEntries(root: string, pkg: PackageJSON): Promise<[string, string][]> {
	const workspacesField = pkg.workspaces;
	if (!workspacesField) return [];

	// resolve workspace globs to absolute directories
	const workspaces = await fg(workspacesField as string | string[], {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	// map each workspace directory to its package name (if present)
	return workspaces.map((workspacePath) => {
		const workspacePkg = readPackageJSON(workspacePath);
		return [workspacePkg.name ?? workspacePath, workspacePath] as [string, string];
	});
}

const globFiles = (root: string, pattern: string | string[]) =>
	fg(pattern, {
		cwd: root,
		onlyFiles: true,
		braceExpansion: true,
		globstar: true,
		absolute: true,
	});

const globFile = (...args: Parameters<typeof globFiles>) =>
	globFiles(...args).then((entries) => entries[0] ?? null);

const messages = {
	'config-not-found':
		"A Vite Config is required for workspace '%s' to be built. skipping workspace '%s' due to missing configuration...",
	'config-resolution-error': "An error occured while resolving a configuration for workspace '%s'.",
	'source-resolution-error': "Cannot resolve the source directory for '%s'.",
};

const logger = new Logger();

function logf(format: string, ...params: string[]) {
	logger.log(logger.format(format, ...(params as string[])));
}

// warnf intentionally omitted (not used).

type WorkspaceEntry = [string, string];

interface WorkspaceBindingAlias {
	name: string;
	source: string;
}

interface WorkspaceBinding {
	alias: WorkspaceBindingAlias;
}

interface Workspace {
	config: UserConfig;
	configFile: string;
	workspaceBinding: WorkspaceBinding;
	source: string;
	root: string;
}

class ViteMono {
	public root: string;
	public package: Promise<PackageJSON>;

	constructor(options: ViteMonoConfig) {
		const root = path.resolve(process.cwd(), options.root);
		this.root = root;
		this.package = Promise.resolve(readPackageJSON(root));
	}

	async getAllWorkspaceEntries() {
		return workspaceEntries(this.root, await this.package);
	}

	async getBuildConfiguration(
		workspaceName: string,
		workspaceAbsolutePath: string,
	): Promise<NonNullable<Awaited<ReturnType<typeof loadConfigFromFile>>> | null> {
		const viteConfigPath = await globFile(
			workspaceAbsolutePath,
			'vite.config.{cjs,mjs,js,cts,mts,ts}',
		);

		console.log(viteConfigPath);

		if (!viteConfigPath) {
			logf(messages['config-not-found'], workspaceName, workspaceName);
			return null;
		}

		const configResolutionResult = await loadConfigFromFile(
			{
				command: 'build',
				mode: 'production',
			},
			viteConfigPath,
			workspaceAbsolutePath,
			'silent',
			undefined,
			'runner',
		);

		if (!configResolutionResult) {
			logf(messages['config-resolution-error'], workspaceName);
			return null;
		}

		return configResolutionResult;
	}

	async getSourceDirectory(workspaceName: string, workspacePath: string) {
		let source: string | null = null;
		try {
			const pkg = loadPackageJSON(workspacePath);
			if (pkg && typeof pkg.source === 'string' && pkg.source.length > 0) {
				source = pkg.source;
			}
		} catch {
			// ignore package read errors and fallback to scanning dirs
		}

		// also test if source exists.
		// otherwise, fall on through popular
		// source directory names.
		const popularNames = ['src', 'source', 'lib', 'lib/src'];
		const candidates = source ? [source, ...popularNames] : popularNames;
		for (const cand of candidates) {
			const candPath = path.resolve(workspacePath, cand);
			if (fs.existsSync(candPath) && fs.statSync(candPath).isDirectory()) {
				source = cand;
				break;
			}
		}

		if (!source) {
			logf(messages['source-resolution-error'], workspaceName);
			return null;
		}

		return source;
	}

	async getAllWorkspaces(workspaceEntries: WorkspaceEntry[]): Promise<Workspace[]> {
		const workspaces: (Workspace | null)[] = await Promise.all(
			workspaceEntries.map(async ([workspaceName, workspacePath]) => {
				const configResolutionResult = await this.getBuildConfiguration(
					workspaceName,
					workspacePath,
				);

				if (!configResolutionResult) {
					return null;
				}

				const { config, path: viteConfigPath } = configResolutionResult;

				const source = await this.getSourceDirectory(workspaceName, workspacePath);

				if (!source) {
					return null;
				}

				const workspaceBindingAlias: WorkspaceBindingAlias = {
					name: workspaceName,
					source: source,
				};

				const workspaceBinding: WorkspaceBinding = {
					alias: workspaceBindingAlias,
				};

				return {
					config,
					workspaceBinding,
					source,
					root: workspacePath,
					configFile: viteConfigPath,
				};
			}),
		);

		// could have used Boolean but typescript is not
		// happy with that.
		return workspaces.filter((w) => w !== null);
	}

	// returns a set of workspace binding aliases as a map
	// to be used for vite config.
	getWorkspaceBindingAliasMap(workspaces: Workspace[]) {
		return Object.fromEntries(
			workspaces.map((ws) => [ws.workspaceBinding.alias.name, ws.workspaceBinding.alias.source]),
		);
	}

	finalAliasMapFor(workspace: Workspace, bindingAliasMap: Record<string, string>) {
		const clone = { ...bindingAliasMap };

		delete clone[workspace.workspaceBinding.alias.name];

		return clone;
	}

	async build() {
		try {
			const workspaceEntries = await this.getAllWorkspaceEntries();

			// a set to track workspaces.
			// prepare alias map for workspace packages so builds can resolve local packages to their src
			const workspaces = await this.getAllWorkspaces(workspaceEntries);
			const workspaceBindingAliasMap = this.getWorkspaceBindingAliasMap(workspaces);

			for (const workspace of workspaces) {
				const mergedResolve = {
					...(workspace.config.resolve ?? {}),
					alias: {
						...(workspace.config.resolve?.alias ?? {}),
						...this.finalAliasMapFor(workspace, workspaceBindingAliasMap),
					},
				};

				await build({
					...workspace.config,
					root: workspace.root,
					resolve: mergedResolve,
					forceOptimizeDeps: true,
					configFile: workspace.configFile,
					logLevel: 'silent',
				});
			}
		} catch (e) {
			logger.error(String(e));
		}
	}
}

export { ViteMono };
export type { ViteMonoConfig };
