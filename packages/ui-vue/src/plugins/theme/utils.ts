import { defineStore } from 'pinia';
import type { App } from 'vue';

interface ThemeSettingsProperties {
	mode: string;
}
const themeStore = defineStore('theme', {
	actions: {
		setMode(mode: string) {
			this.mode = mode;
		},
	},

	state: (): ThemeSettingsProperties => ({
		mode: 'light',
	}),
});

// base plugin contexts
interface PluginContext {
	themeSettings: ThemeSettingsProperties;
	app: App;
}

// shared context initializer
function createPluginContext(
	app: App,
	themeSettings: ReturnType<typeof themeStore>,
): PluginContext {
	return {
		app,
		themeSettings,
	};
}

type Store = Omit<ReturnType<typeof themeStore>, 'mode' | 'setMode'>;

function createNullStore<
	const I extends string,
	const S extends object,
	const A extends Record<string, (...args: any[]) => unknown>,
>(storeId: I, states: S, actions: A) {
	return {
		...states,
		...actions,
		$id: storeId,
		$state: states,
		$patch() {
			/* no-op */
		},
		$reset() {
			/* no-op */
		},
		$subscribe() {
			return () => {
				/* no-op */
			};
		},
		$onAction() {
			return () => {
				/* no-op */
			};
		},
	};
}

export { themeStore, createPluginContext, createNullStore };
export type { ThemeSettingsProperties, PluginContext };
