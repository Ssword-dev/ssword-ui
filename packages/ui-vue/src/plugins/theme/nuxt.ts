import { defineNuxtPlugin } from 'nuxt/app';
import { createNullStore, createPluginContext, themeStore } from './utils';
import { createClientPluginContext, initClient } from './client';
import { createServerPluginContext, initServer } from './server';

export default () =>
	defineNuxtPlugin((nuxtApp) => {
		// Server-side initialization
		if (process.server) {
			const baseContext = createPluginContext(
				nuxtApp.vueApp,
				createNullStore(
					'theme',
					{ mode: 'light' },
					{
						setMode(mode: string) {},
					},
				) as unknown as ReturnType<typeof themeStore>,
			);

			const serverContext = createServerPluginContext(baseContext);
			initServer(serverContext);
			console.log('Theme plugin: Server context initialized');
		}

		// Client-side initialization
		if (process.client) {
			// Use nextTick to ensure Vue app is ready
			Promise.resolve().then(() => {
				const baseContext = createPluginContext(nuxtApp.vueApp, themeStore());
				const clientContext = createClientPluginContext(baseContext);
				initClient(clientContext);
				console.log('Theme plugin: Client context initialized');
			});
		}
	});
