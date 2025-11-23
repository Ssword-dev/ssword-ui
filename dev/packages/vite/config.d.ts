import type { BuildEnvironmentOptions, UserConfig } from 'vite';

interface LibraryConfigOptions {
	/** The file URL of the package's config file (usually import.meta.url) */
	configFile: string | URL;
	/** Path to tsconfig.json relative to package root */
	tsConfig?: string;
	/** Overrides for Vite configuration */
	overrides?: OverrideConfig;
}

interface LibraryConfig extends UserConfig {}

type _OverrideConfig = Omit<UserConfig, 'build'> & {
	build?: Omit<UserConfig['build'], 'rollupOptions'> & {
		rollupOptions?: Omit<BuildEnvironmentOptions['rollupOptions'], 'external' | 'output'>;
	};
};

interface OverrideConfig extends _OverrideConfig {}

/**
 * Defines a Vite configuration optimized for library development
 * Features:
 * - Transpile-only (no bundling) with preserveModules
 * - Externalizes all dependencies
 * - Generates both ESM (.mjs) and CJS (.cjs) outputs
 * - Emits TypeScript declaration files
 * - Configurable through overrides
 */
export function defineLibraryConfig(options: LibraryConfigOptions): LibraryConfig;
export type { LibraryConfig, UserConfig };
