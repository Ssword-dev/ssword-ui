import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fg from 'fast-glob';
import fs from 'node:fs';
import { build, loadConfigFromFile, UserConfig } from 'vite';
import Logger from './logger';
import require from './require';

function importJSON(filePath: string) {
	return require(filePath);
}

function importPackageJSON(filePath: string) {
	return importJSON(path.resolve(filePath, './package.json'));
}

interface ViteMonoConfig {
	root: string;
}

async function workspaceEntries(
	root: string,
	packageObject: Record<string, unknown>,
): Promise<[string, string][]> {
	if (!packageObject.workspaces) {
		return [];
	}

	// resolve all these workspaces to actual paths.
	const workspaces = await fg(packageObject.workspaces as string | string[], {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	const aliasEntries = await Promise.all(
		workspaces.map(async (workspacePath: string) => {
			const workspacePackageFile = path.resolve(workspacePath, 'package.json');
			const workspacePackageObject = await importJSON(workspacePackageFile);

			// return the workspace root (not the src folder) so we can locate vite configs
			return [workspacePackageObject.name, workspacePath] as [string, string];
		}),
	);

	return aliasEntries;
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

type WorkspaceEntry = [string, string];

interface Workspace {
	config: UserConfig;
	configFile: string;
	workspaceBindingAliases: Record<string, string>;
	source: string;
	root: string;
}

class ViteMono {
	public root: string;
	public package: Promise<Record<string, string | string[]>>;

	constructor(options: ViteMonoConfig) {
		const root = path.resolve(process.cwd(), options.root);
		this.root = root;
		this.package = importPackageJSON(root);
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
			logger.log(messages['config-not-found'], workspaceName, workspaceName);
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
			logger.log(messages['config-resolution-error'], workspaceName);
			return null;
		}

		return configResolutionResult;
	}

	async getSourceDirectory(workspaceName: string, workspacePath: string) {
		let source: string | null = null;
		try {
			const pkg = await importJSON(path.resolve(workspacePath, 'package.json'));
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
			logger.log(messages['source-resolution-error'], workspaceName);
			return null;
		}

		return source;
	}

	async getAllWorkspaces(workspaceEntries: WorkspaceEntry[]): Promise<Workspace[]> {
		const workspaceMap = Object.fromEntries(workspaceEntries);
		const workspaces: (Workspace | null)[] = await Promise.all(
			workspaceEntries.map(async ([workspaceName, workspacePath]) => {
				const workspaceBindingAliases = { ...workspaceMap };

				// remove the current workspace package itself.
				delete workspaceBindingAliases[workspaceName];

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

				return {
					config,
					workspaceBindingAliases,
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

	async build() {
		const workspaceEntries = await this.getAllWorkspaceEntries();

		// a set to track workspaces.
		// prepare alias map for workspace packages so builds can resolve local packages to their src
		const workspaces = await this.getAllWorkspaces(workspaceEntries);

		for (const workspace of workspaces) {
			const mergedResolve = {
				...(workspace.config.resolve ?? {}),
				alias: {
					...(workspace.config.resolve?.alias ?? {}),
					...workspace.workspaceBindingAliases,
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
	}
}

export { ViteMono };
export type { ViteMonoConfig };
