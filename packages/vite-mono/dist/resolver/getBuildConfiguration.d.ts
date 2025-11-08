import { loadConfigFromFile } from 'vite';
import type { Compilation } from '../core/types';
export declare function getBuildConfiguration(comp: Compilation, workspaceName: string, workspaceAbsolutePath: string): Promise<NonNullable<Awaited<ReturnType<typeof loadConfigFromFile>>> | null>;
