<script setup lang="ts">
	import { computed, provide, ref } from 'vue';
	import themeStore, { type ThemeMode, type ThemeSettings } from '@/stores/theme';
	import { useEffect } from '@ssword/ui-vue';

	const controller = ref<AbortController | null>(null);
	const headObserver = new MutationObserver((mutationList) => {
		resilienceCallback(mutationList);
	});
	const cachedThemes = computed(() => new Map<string, string>());
	const theme = themeStore();

	function setThemeStyle(cssText: string): void {
		const styleElement = document.getElementById('theme-style')!;
		styleElement.innerHTML = cssText;
	}

	function applyThemeStyle(theme: ThemeMode): void {
		const cachedStyle = cachedThemes.value.get(theme);

		if (cachedStyle) {
			setThemeStyle(cachedStyle);
			return;
		}
	}

	function createStyleIfNotExist(): void {
		if (document.getElementById('theme-style')) {
			return;
		}

		const themeStyle = document.createElement('style');

		// give it an id so we can easily find and update it later.
		themeStyle.setAttribute('id', 'theme-style');

		// append the empty style tag to the head.
		document.head.appendChild(themeStyle);
	}

	// function to repair the style element if it gets removed.
	function repairStyle(): void {
		createStyleIfNotExist();
		applyThemeStyle(theme.mode);
	}

	// function to try and repair the style if needed.
	function tryRepairStyle(): void {
		const styleElement = document.getElementById('theme-style');

		if (!styleElement) {
			repairStyle();
		}
	}

	function resilienceCallback(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				for (const removedNode of mutation.removedNodes) {
					if (
						removedNode instanceof Element &&
						removedNode.tagName === 'style' &&
						removedNode.getAttribute('id') === 'theme-style'
					) {
						repairStyle();
					}
				}
			}
		}
	}

	async function applyThemeChanges() {
		if (cachedThemes.value.has(theme.mode)) {
			applyThemeStyle(theme.mode);
			return;
		}

		const themeFile = `${theme.mode}.css`;
		const themeLink = new URL(`/themes/${themeFile}`, window.location.href).href;

		// abort any ongoing fetches
		if (controller.value) {
			controller.value.abort();
			controller.value = null;
		}

		const currentController = new AbortController();

		// assign a current controller to sign an ongoing fetch.
		controller.value = currentController;

		let res;

		// fetch with a signal
		try {
			res = await fetch(themeLink, {
				signal: currentController.signal,
			});
		} catch (e) {
			if (e instanceof Error && e.name === 'AbortError') {
				return;
			}

			throw e; // propagate all non-abort errors.
		}

		const cssText = await res.text();

		// cache the theme style.
		cachedThemes.value.set(theme.mode, cssText);

		// try to repair the style element if it was removed.
		tryRepairStyle();

		// set the theme style.
		setThemeStyle(cssText);

		// clear the controller so next time, it can detect if there is an ongoing fetch.
		controller.value = null;
	}

	function initializeObserver() {
		headObserver.observe(document.head, {
			childList: true,
			subtree: false,
		});
	}

	useEffect(() => {
		initializeObserver();
		createStyleIfNotExist();
	}, []);

	useEffect(() => {
		applyThemeChanges();
	}, []);

	useEffect(() => {
		applyThemeChanges();
	}, [() => theme.mode]);

	provide('theme-settings', theme as ThemeSettings);
</script>

<template>
	<slot />
</template>
