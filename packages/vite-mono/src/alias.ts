import path from 'node:path';
import type { Workspace, Compilation } from './types';

/** Build alias map from workspace package name -> absolute source directory. */
export function getWorkspaceBindingAliasMap(comp: Compilation, workspaces: Workspace[]) {
	return Object.fromEntries(
		workspaces.map((ws) => [ws.workspaceBinding.alias.name, path.resolve(ws.root, ws.source)]),
	);
}

/** Return alias map for a workspace but exclude the workspace's own package name. */
export function finalAliasMapFor(workspace: Workspace, bindingAliasMap: Record<string, string>) {
	const clone = { ...bindingAliasMap };
	delete clone[workspace.workspaceBinding.alias.name];
	return clone;
}
