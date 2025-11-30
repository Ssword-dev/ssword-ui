/* eslint-disable */

import nx from '@nx/eslint-plugin';
import { Linter } from 'eslint';

interface LibraryNXOptions {
	presets: (keyof typeof nx.configs)[];
}

export interface LibraryConfigUserOptions {
	configPresets?: Linter.Config[];
	config?: Linter.Config;
	nx?: LibraryNXOptions;
}

export interface LibraryConfig extends Array<Linter.Config> {}

declare function createLibraryConfig(options: LibraryConfigUserOptions): LibraryConfig;

interface ApplicationNXOptions {
	presets: (keyof typeof nx.configs)[];
}

export interface ApplicationConfigUserOptions {
	configPresets?: Linter.Config[];
	config?: Linter.Config;
	nx?: ApplicationNXOptions;
}

export interface ApplicationConfig extends Array<Linter.Config> {}

declare function createApplicationConfig(options: ApplicationConfigUserOptions): ApplicationConfig;

// workspace configuration

export interface WorkspaceNXOptions {
	configPresets?: Array<keyof typeof nx.configs>;
}

export interface WorkspaceRootConfigUserOptions {
	ignores?: string[];
	extraRules?: Linter.RulesRecord;
	nx?: WorkspaceNXOptions;
}

export interface WorkspaceRootConfig extends Array<Linter.Config> {}

export declare function createWorkspaceRootConfig(
	options?: WorkspaceRootConfigUserOptions,
): WorkspaceRootConfig;

export { createLibraryConfig, createApplicationConfig, createWorkspaceRootConfig };
