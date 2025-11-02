import { fileURLToPath, URL } from 'node:url';
import { defineConfig, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx(), vueDevTools()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			fileName: (format, entryName) => `${entryName}.${format}.js`,
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
