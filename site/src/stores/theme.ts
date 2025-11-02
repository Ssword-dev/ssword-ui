import { defineStore } from 'pinia';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const themes = ['light', 'dark'] as const;

type ThemeMode = (typeof themes)[number];

interface ThemeSettings {
	mode: ThemeMode;
}

const themeStore = defineStore('theme-store', {
	persist: {
		key: 'theme',
		storage: localStorage,
	},

	state: () => {
		return {
			mode: 'light' as ThemeMode,
		} as ThemeSettings;
	},

	actions: {
		setTheme(mode: ThemeMode) {
			this.mode = mode;
		},
	},
});

export default themeStore;
export type { ThemeMode, ThemeSettings };
