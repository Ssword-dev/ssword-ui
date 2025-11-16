import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import path from 'path';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatExtensions = {
	es: 'mjs',
	cjs: 'cjs',
};

// https://vite.dev/config/
export default defineConfig({
	plugins: [],
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
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},

		sourcemap: true,
		emptyOutDir: true,
	},
});
