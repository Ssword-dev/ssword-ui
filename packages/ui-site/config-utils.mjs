import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import { createRequire } from 'node:module';
import jsYaml from 'js-yaml';

function importJSON(filePath) {
	const absPath = path.resolve(filePath);
	const raw = fs.readFileSync(absPath, 'utf-8');
	return JSON.parse(raw);
}

function importYaml(filePath) {
	try {
		const source = fs.readFileSync(filePath, { encoding: 'utf-8' });
		return jsYaml.load(source);
	} catch (e) {
		if (e instanceof Error && 'code' in e) {
			const fsError = e;

			if (fsError.code === 'ENOENT') {
				throw new Error('Failed to load yaml file: ' + `'${filePath}'`);
			}
		}
	}
}

async function workspacePackages(root) {
	const workspaceFile = path.resolve(root, 'pnpm-workspace.yaml');
	const workspace = importYaml(workspaceFile);

	if (typeof workspace !== 'object' || !workspace.packages) {
		return [];
	}

	// resolve all these workspaces to actual paths.
	const workspaces = await fg(workspace.packages, {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	const packages = workspaces.map((workspacePath) => {
		const workspacePackageFile = path.resolve(workspacePath, 'package.json');
		const workspacePackage = importJSON(workspacePackageFile);

		return workspacePackage.name;
	});

	return packages;
}

export { workspacePackages };
