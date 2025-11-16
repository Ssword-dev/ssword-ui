import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import { createRequire } from 'node:module';
import jsYaml from 'js-yaml';

const require = createRequire(fileURLToPath(import.meta.url));

function importJSON(filePath: string) {
	return require(filePath);
}

function importYaml(filePath: string) {
	try {
		const source = fs.readFileSync(filePath, { encoding: 'utf-8' });
		return jsYaml.load(source);
	} catch (e) {
		if (e instanceof Error && 'code' in e) {
			const fsError = e as NodeJS.ErrnoException;

			if (fsError.code === 'ENOENT') {
				throw new Error('Failed to load yaml file: ' + `'${filePath}'`);
			}
		}
	}
}

function virtualWorkspaceModules(root: string) {
	const packageFile = path.resolve(root, 'pnpm-workspace.yaml');
	const packageObject = importYaml(packageFile) as object;

	if (typeof packageObject !== 'object' || !packageObject.packages) {
		return {};
	}

	// resolve all these workspaces to actual paths.
	const workspaces = fg.sync(packageObject.packages as string[], {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	const aliasEntries = workspaces.map((workspacePath: string) => {
		const workspacePackageFile = path.resolve(workspacePath, 'package.json');
		const workspacePackageObject = importJSON(workspacePackageFile);

		return [workspacePackageObject.name, path.resolve(workspacePath, './src')] as const;
	});

	return Object.fromEntries(aliasEntries);
}

export { virtualWorkspaceModules };
