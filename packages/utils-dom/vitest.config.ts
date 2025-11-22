import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig(
		defineConfig({
			test: {
				globals: true,
				environment: 'jsdom',
				coverage: {
					reporter: ['text', 'lcov'],
				},
			},
		}),
	),
);
