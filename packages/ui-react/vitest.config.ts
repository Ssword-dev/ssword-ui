import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';
import { LibraryConfig } from '@workspace/vite/config';

const config: LibraryConfig = mergeConfig(
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

export default config;
