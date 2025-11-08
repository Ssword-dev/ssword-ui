import fg from 'fast-glob';
import { readPackageJSON } from '../core/utils';
import type { WorkspaceEntry } from '../core/types';
import type { PackageJSON } from '../schema/package-json.schema';

export async function getAllWorkspaceEntries(
	root: string,
	pkg: PackageJSON,
): Promise<WorkspaceEntry[]> {
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
