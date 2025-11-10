import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import { createRequire } from 'node:module';

const require = createRequire(fileURLToPath(import.meta.url));

async function importJSON(filePath: string) {
	return require(filePath);
}

async function mapWorkspacesDev(root: string) {
	const packageFile = path.resolve(root, 'package.json');
	const packageObject = await importJSON(packageFile);

	if (!packageObject.workspaces) {
		return {};
	}

	// resolve all these workspaces to actual paths.
	const workspaces = fg.sync(packageObject.workspaces, {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	const aliasEntries = await Promise.all(
		workspaces.map(async (workspacePath: string) => {
			const workspacePackageFile = path.resolve(workspacePath, 'package.json');
			const workspacePackageObject = await importJSON(workspacePackageFile);

			return [workspacePackageObject.name, path.resolve(workspacePath, './src')] as const;
		}),
	);

	return Object.fromEntries(aliasEntries);
}

export { mapWorkspacesDev };
