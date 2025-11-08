import type { Workspace, Compilation } from './types';
/** Build alias map from workspace package name -> absolute source directory. */
export declare function getWorkspaceBindingAliasMap(comp: Compilation, workspaces: Workspace[]): {
    [k: string]: string;
};
/** Return alias map for a workspace but exclude the workspace's own package name. */
export declare function finalAliasMapFor(workspace: Workspace, bindingAliasMap: Record<string, string>): {
    [x: string]: string;
};
