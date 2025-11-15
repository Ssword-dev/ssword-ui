import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// tailwind
import tailwind from '@tailwindcss/vite';

// virtual modules
import { virtualWorkspaceModules } from './vite-config-utils';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const appRoot = resolve(siteRoot, './app');

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	// vite
	vite: {
		resolve: {
			alias: {
				'@': appRoot,
				...(process.env.NODE_ENV !== 'production' ? virtualWorkspaceModules(projectRoot) : {}),
			},
		},

		plugins: [tailwind()],
	},
});
