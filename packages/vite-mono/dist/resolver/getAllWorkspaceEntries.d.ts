import type { WorkspaceEntry } from '../core/types';
import type { PackageJSON } from '../schema/package-json.schema';
export declare function getAllWorkspaceEntries(root: string, pkg: PackageJSON): Promise<WorkspaceEntry[]>;
