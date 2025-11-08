import type { Compilation, WorkspaceEntry, Workspace } from '../core/types';
export declare function getAllWorkspaces(comp: Compilation, workspaceEntries: WorkspaceEntry[]): Promise<Workspace[]>;
