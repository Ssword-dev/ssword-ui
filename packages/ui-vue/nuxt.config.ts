import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	vite: {
		optimizeDeps: {
			include: ['@ssword'],
		},
	},
});
