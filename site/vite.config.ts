import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import tailwind from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { mapWorkspacesDev } from './vite-config-utils';

export default defineConfig(async ({ command, mode }) => {
	const isDev = command === 'serve' || mode === 'development';
	return {
		plugins: [tailwind(), vue(), vueJsx(), vueDevTools()],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				...(isDev ? await mapWorkspacesDev(fileURLToPath(new URL('../', import.meta.url))) : {}),
			},
		},
	};
});
