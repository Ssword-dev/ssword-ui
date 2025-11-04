import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.spec.{ts,js}', 'src/**/*.test.{ts,js}'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			exclude: ['**/node_modules/**', '**/dist/**'],
		},
		deps: {
			inline: [],
		},
	},
});
