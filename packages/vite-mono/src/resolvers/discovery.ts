import fg from 'fast-glob';
import { readPackageJSON } from '../utils';
import type { WorkspaceEntry } from '../types';
import { PackageJSON } from '../core/package';

export async function workspaceEntries(root: string, pkg: PackageJSON): Promise<WorkspaceEntry[]> {
	const workspacesField = pkg.workspaces;
	if (!workspacesField) return [];

	const workspaces = await fg(workspacesField as string | string[], {
		cwd: root,
		onlyDirectories: true,
		absolute: true,
	});

	return workspaces.map((workspacePath) => {
		const workspacePkg = readPackageJSON(workspacePath);
		return [workspacePkg.name ?? workspacePath, workspacePath] as WorkspaceEntry;
	});
}

export async function getAllWorkspaceEntries(comp: any) {
	return workspaceEntries(
		comp.context.root,
		await (comp.context.package ?? Promise.resolve({} as any)),
	);
}
