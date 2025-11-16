import { createNullStore } from './utils';
import type { PluginContext } from './utils';

interface ServerOnlyPluginContext {}
interface ServerPluginContext extends PluginContext, ServerOnlyPluginContext {}

function createPlaceholderThemeSettings() {
	return {
		mode: 'light',
		setMode() {
			/* pass */
		},
	};
}

// server context initializer
function createServerPluginContext(shared: PluginContext): ServerPluginContext {
	return { ...shared };
}

function initServer(context: ServerPluginContext) {
	context.app.provide(
		'theme-settings',
		createNullStore(
			'theme-store',
			{
				mode: 'light',
			},
			{
				setMode: (_: string) => {},
			},
		),
	);
}

export { createServerPluginContext, initServer };
