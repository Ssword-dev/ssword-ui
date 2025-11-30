import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { createApplicationConfig } from '@workspace/eslint/config';

const eslintConfig = createApplicationConfig({
	configPresets: [
		...nextVitals,
		...nextTs,
		// Override default ignores of eslint-config-next.
		globalIgnores([
			// Default ignores of eslint-config-next:
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
		]),
	],
});

export default eslintConfig;
