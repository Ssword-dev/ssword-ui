import { fileURLToPath, URL } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatExtensions = {
	es: 'mjs',
	cjs: 'cjs',
};

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		dts({
			tsconfigPath: 'tsconfig.lib.json',
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			fileName: (format, entryName) =>
				`${entryName}.${formatExtensions[format as keyof typeof formatExtensions]}`,
			formats: ['es', 'cjs'], // build both ESM and CJS
		},

		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				// keep original file structure
				preserveModules: true,
				preserveModulesRoot: 'src',

				// directory structure for individual imports
				entryFileNames: '[name].[format].js',
				chunkFileNames: '[name]-[hash].[format].js',
				assetFileNames: '[name].[ext]',
			},
		},

		sourcemap: true,
		emptyOutDir: true,
	},
});
