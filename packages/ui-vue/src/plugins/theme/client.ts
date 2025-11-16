import { defineStore } from 'pinia';
import { effectScope, watch, type App } from 'vue';
import type { PluginContext, ThemeSettingsProperties } from './utils';
import { themeStore, createPluginContext } from './utils';

interface ClientOnlyPluginContext {
	controller: AbortController | null;
	observer: MutationObserver | null;
	cache: Map<string, string>;
	scope: any;
}

interface ClientPluginContext extends PluginContext, ClientOnlyPluginContext {}

// Client-side check utility
const isClient = typeof window !== 'undefined';

// Safe DOM access helper
function safeDOMOperation<T>(operation: () => T, fallback?: T): T {
	if (!isClient) return fallback as T;
	try {
		return operation();
	} catch (error) {
		console.warn('DOM operation failed:', error);
		return fallback as T;
	}
}

function createClientPluginContext(shared: PluginContext): ClientPluginContext {
	let controller: AbortController | null = null;
	const cache = new Map<string, string>();

	const self = {
		...shared,
		controller,
		cache,
		observer: null as MutationObserver | null,
		scope: null,
	} as ClientPluginContext;

	// Only create observer on client side
	if (isClient) {
		const observer = new MutationObserver((mutationList) => {
			resilienceCallback(self, mutationList);
		});
		self.observer = observer;
	}

	return self;
}

function applyThemeStyle(context: ClientPluginContext): void {
	safeDOMOperation(() => {
		const cachedStyle = context.cache.get(context.themeSettings.mode);
		if (cachedStyle) {
			setThemeStyle(cachedStyle);
		}
	});
}

function setThemeStyle(cssText: string): void {
	safeDOMOperation(() => {
		const styleElement = document.getElementById('theme-style');
		if (styleElement) {
			styleElement.innerHTML = cssText;
		} else {
			// Create if doesn't exist
			createStyleIfNotExist();
			const newStyleElement = document.getElementById('theme-style');
			if (newStyleElement) {
				newStyleElement.innerHTML = cssText;
			}
		}
	});
}

function createStyleIfNotExist(): void {
	safeDOMOperation(() => {
		if (document.getElementById('theme-style')) return;

		const themeStyle = document.createElement('style');
		themeStyle.setAttribute('id', 'theme-style');
		themeStyle.setAttribute('data-theme', 'dynamic'); // Mark as dynamically added
		document.head.appendChild(themeStyle);
	});
}

function repairStyle(context: ClientPluginContext): void {
	safeDOMOperation(() => {
		createStyleIfNotExist();
		applyThemeStyle(context);
	});
}

function tryRepairStyle(context: ClientPluginContext): void {
	if (!isClient) return;

	const styleElement = document.getElementById('theme-style');
	if (!styleElement) {
		repairStyle(context);
	}
}

function resilienceCallback(context: ClientPluginContext, mutations: MutationRecord[]): void {
	if (!isClient) return;

	for (const mutation of mutations) {
		if (mutation.type === 'childList') {
			for (const removedNode of mutation.removedNodes) {
				if (
					removedNode instanceof Element &&
					removedNode.tagName.toLowerCase() === 'style' &&
					removedNode.getAttribute('id') === 'theme-style'
				) {
					console.warn('Theme style element was removed, repairing...');
					repairStyle(context);
				}
			}
		}
	}
}

async function applyThemeChanges(context: ClientPluginContext): Promise<void> {
	if (!isClient) return;

	// Use cached version if available
	if (context.cache.has(context.themeSettings.mode)) {
		applyThemeStyle(context);
		return;
	}

	const themeFile = `${context.themeSettings.mode}.css`;
	const themeLink = new URL(`/themes/${themeFile}`, window.location.href).href;

	// Abort previous request if exists
	if (context.controller) {
		context.controller.abort();
		context.controller = null;
	}

	const currentController = new AbortController();
	context.controller = currentController;

	try {
		const res = await fetch(themeLink, {
			signal: currentController.signal,
			cache: 'no-cache', // Prevent caching issues
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch theme: ${res.status} ${res.statusText}`);
		}

		const cssText = await res.text();
		context.cache.set(context.themeSettings.mode, cssText);

		// Only apply if this is still the current request
		if (context.controller === currentController) {
			tryRepairStyle(context);
			setThemeStyle(cssText);
			context.controller = null;
		}
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			// Request was cancelled, ignore
			return;
		}
		console.error('Failed to load theme:', error);
		// You might want to apply a fallback theme here
	}
}

function initializeObserver(context: ClientPluginContext): void {
	safeDOMOperation(() => {
		if (context.observer && document.head) {
			context.observer.observe(document.head, {
				childList: true,
			});
		}
	});
}

function cleanupClient(context: ClientPluginContext): void {
	if (context.controller) {
		context.controller.abort();
		context.controller = null;
	}

	if (context.observer) {
		context.observer.disconnect();
		context.observer = null;
	}

	if (context.scope) {
		context.scope.stop();
		context.scope = null;
	}
}

function initClient(context: ClientPluginContext) {
	if (!isClient) return;

	const scope = effectScope(true);
	context.scope = scope;

	scope.run(() => {
		// Initialize on client start
		createStyleIfNotExist();
		initializeObserver(context);
		applyThemeChanges(context);

		// Watch for theme changes
		watch(
			() => context.themeSettings,
			(newSettings, oldSettings) => {
				if (newSettings.mode !== oldSettings?.mode) {
					applyThemeChanges(context);
				}
			},
			{ deep: true },
		);
	});

	// Cleanup on unmount
	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', () => cleanupClient(context));
	}
}

function client(shared?: PluginContext) {
	return {
		install(app: App) {
			// Only install on client side
			if (!isClient) return;

			const $shared = shared ?? createPluginContext(app, themeStore());
			const clientContext = createClientPluginContext($shared);

			// Use nextTick to ensure DOM is ready
			app.config.globalProperties.$nextTick(() => {
				initClient(clientContext);
			});

			// Provide cleanup method
			app.config.globalProperties.$themeCleanup = () => cleanupClient(clientContext);
		},
	};
}

// Export individual functions for testing
export {
	themeStore,
	type ThemeSettingsProperties,
	type PluginContext,
	type ClientPluginContext,
	initClient,
	createPluginContext,
	createClientPluginContext,
	applyThemeStyle,
	applyThemeChanges,
	createStyleIfNotExist,
	setThemeStyle,
	initializeObserver,
	repairStyle,
	tryRepairStyle,
	resilienceCallback,
	isClient, // Export the client check
	client as default,
};
