import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// tailwind
import tailwind from '@tailwindcss/vite';

// virtual modules
import { virtualWorkspaceModules } from './vite-config-utils';
import { nodeModuleNameResolver } from 'typescript';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const appRoot = resolve(siteRoot, './app');

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	alias: {
		...(process.env.NODE_ENV !== 'production' ? virtualWorkspaceModules(projectRoot) : {}),
	},

	build: {
		transpile: ['@ssword/utils', '@ssword-ui/vue'],
	},

	// vite
	vite: {
		plugins: [tailwind()],
		ssr: {
			noExternal: ['@ssword-ui/vue', /@ssword\/.*/],
		},
	},

	devServer: {
		host: 'localhost',
		port: 80,
	},

	// server configuration
	nitro: {
		preset: 'vercel',
	},

	envDir: './env',

	modules: ['@nuxt/kit', '@nuxt/content', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],

	// module configurations
});
