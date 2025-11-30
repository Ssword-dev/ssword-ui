'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';

interface ThemeSettings {
	mode: string;
}

interface DocumentContext {
	observer?: MutationObserver;
	styleElement?: HTMLStyleElement;
}

interface RequestContext {
	abortController: AbortController;
	abortSignal: AbortSignal;
}

interface HelperContext {
	applyStyle(css: string): void;
	fetchTheme(mode: string): void;
	getStyleElement(): HTMLStyleElement | null;
}

interface InternalContext {
	id: string;
	cache: Map<string, string>;
	documentContext: DocumentContext | null;
	requestContext: RequestContext | null;
	helperContext: HelperContext;
}

interface PrivateThemeContextProperties {
	_internalContext: InternalContext;
}

interface PublicThemeContextProperties {
	themeSettings: ThemeSettings;
	setThemeMode: React.Dispatch<React.SetStateAction<string>>;
}

interface ClientThemeContext extends PrivateThemeContextProperties, PublicThemeContextProperties {}

// Helper functions that don't depend on context initialization
const createGetStyleElementFn = (id: string, documentContext: DocumentContext) => {
	return (): HTMLStyleElement | null => {
		if (typeof window === 'undefined') return null;

		// Use cached style element
		if (documentContext.styleElement) {
			return documentContext.styleElement;
		}

		const styleElementId = `theme-styles-${id}`;
		const existingStyleElement = document.getElementById(styleElementId);

		if (existingStyleElement) {
			documentContext.styleElement = existingStyleElement as HTMLStyleElement;
			return existingStyleElement as HTMLStyleElement;
		}

		const styleElement = document.createElement('style');
		styleElement.setAttribute('id', styleElementId);
		styleElement.setAttribute('data-theme', 'dynamic');
		documentContext.styleElement = styleElement;

		return styleElement;
	};
};

const createApplyStyleFn = (getStyleElement: () => HTMLStyleElement | null) => {
	return (css: string) => {
		const styleElement = getStyleElement();
		if (styleElement) {
			styleElement.innerText = css;
			// Ensure it's in the document head
			if (!styleElement.parentNode) {
				document.head.appendChild(styleElement);
			}
		}
	};
};

const createFetchThemeFn = (
	cache: Map<string, string>,
	requestContext: RequestContext | null,
	setRequestContext: (ctx: RequestContext | null) => void,
	applyStyle: (css: string) => void,
) => {
	return async (themeMode: string) => {
		// Abort previous request if exists
		if (requestContext) {
			requestContext.abortController.abort();
		}

		const currentController = new AbortController();
		const newRequestContext: RequestContext = {
			abortController: currentController,
			abortSignal: currentController.signal,
		};

		setRequestContext(newRequestContext);

		try {
			// Check cache first
			const cached = cache.get(themeMode);
			if (cached) {
				applyStyle(cached);
				setRequestContext(null);
				return;
			}

			const res = await fetch(`/themes/${themeMode}.css`, {
				signal: currentController.signal,
				cache: 'no-cache',
			});

			if (!res.ok) throw new Error(`Failed to fetch theme: ${res.status}`);

			const cssText = await res.text();
			cache.set(themeMode, cssText);
			applyStyle(cssText);
			setRequestContext(null);
		} catch (e) {
			if (!(e instanceof Error)) {
				throw e; // propagate downwards.
			}

			if (e.name === 'AbortError') return;
			console.error('Theme fetch failed', e);
			setRequestContext(null);
		}
	};
};

const createInternalContext = (id: string): InternalContext => {
	const cache = new Map<string, string>();
	const documentContext: DocumentContext = {};
	let requestContext: RequestContext | null = null;

	// Create setter for request context that will be used in closures
	const setRequestContext = (ctx: RequestContext | null) => {
		requestContext = ctx;
	};

	const getStyleElement = createGetStyleElementFn(id, documentContext);
	const applyStyle = createApplyStyleFn(getStyleElement);
	const fetchTheme = createFetchThemeFn(cache, requestContext, setRequestContext, applyStyle);

	const helperContext: HelperContext = {
		applyStyle,
		fetchTheme,
		getStyleElement,
	};

	return {
		id,
		cache,
		documentContext,
		requestContext,
		helperContext,
	};
};

const useInternalContext = () => {
	const id = useId();
	const internalContext = useMemo(() => createInternalContext(id), [id]);
	return internalContext;
};

const ThemeContext = createContext<ClientThemeContext | null>(null);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useTheme must be used within ThemeProvider');
	return context;
};

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const internalContext = useInternalContext();
	const [mode, setMode] = useState('light');
	const observer = useRef<MutationObserver | null>(null);

	useEffect(() => {
		const { helperContext, cache } = internalContext;

		// Initial load
		const cached = cache.get(mode);
		if (cached) {
			helperContext.applyStyle(cached);
		} else {
			helperContext.fetchTheme(mode);
		}

		// Observer to repair removed style element
		const styleElement = helperContext.getStyleElement();
		if (styleElement) {
			observer.current = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					mutation.removedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.id === `theme-styles-${internalContext.id}`) {
							const currentCss = cache.get(mode);
							if (currentCss) {
								// Re-apply the style after a brief delay to ensure DOM is stable
								setTimeout(() => helperContext.applyStyle(currentCss), 10);
							}
						}
					});
				}
			});

			observer.current.observe(document.head, { childList: true, subtree: true });
		}

		return () => {
			// Abort any ongoing request
			if (internalContext.requestContext) {
				internalContext.requestContext.abortController.abort();
			}
			observer.current?.disconnect();
		};
	}, [mode, internalContext]);

	const value: ClientThemeContext = useMemo(
		() => ({
			themeSettings: { mode },
			setThemeMode: setMode,
			_internalContext: internalContext,
		}),
		[mode, internalContext],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
