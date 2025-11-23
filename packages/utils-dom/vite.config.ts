import { defineLibraryConfig, LibraryConfig } from '@workspace/vite/config';

const config: LibraryConfig = defineLibraryConfig({
	configFile: import.meta.url,
	tsConfig: 'tsconfig.lib.json',
	overrides: {},
});

export default config;
