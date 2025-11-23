import { fileURLToPath, URL } from 'node:url';
import { defineLibraryConfig, LibraryConfig } from '@workspace/vite/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
const config: LibraryConfig = defineLibraryConfig({
	configFile: import.meta.url,
	overrides: {
		plugins: [
			...(viteStaticCopy({
				targets: [
					{
						src: './src/styles/**/*',
						dest: './styles',
					},
				],
			}) as any),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	},
});

export default config;
