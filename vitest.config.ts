import pkg from './package.json';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: pkg.workspaces,
	},
});
