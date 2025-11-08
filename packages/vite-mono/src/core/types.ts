import { PackageJSON } from '../schema/package-json.schema';
import Logger from './logger';
import { UserConfig } from 'vite';

export type PromiseOr<T> = T | Promise<T>;

export interface ViteMonoConfig {
	root: string;
}

export interface ViteMonoWorkspaceConfig {
	source?: string;
}

export type WorkspaceEntry = [string, string];

export interface WorkspaceBindingAlias {
	name: string;
	source: string;
}

export interface WorkspaceBinding {
	alias: WorkspaceBindingAlias;
}

export interface Workspace {
	config: UserConfig;
	configFile: string;
	workspaceBinding: WorkspaceBinding;
	source: string;
	root: string;
}

export interface CompilationContext {
	root: string;
	package?: Promise<PackageJSON> | null;
	temp?: string | null;
	cleanupHooked?: boolean;
}

export interface Compilation {
	context: CompilationContext;
	logger: Logger;
}

const strict = {};

export { strict };
