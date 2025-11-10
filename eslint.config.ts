import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
	{
		name: 'root/includes',
		files: ['**/*.{ts,mts,tsx,vue}'],
	},

	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

	pluginVue.configs['flat/essential'],
	vueTsConfigs.recommended,

	// user config here
	{
		name: 'custom-rules',
		rules: {
			// disable the rule that enforces component names
			// to be multi word. this is too restrictive for
			// library development.
			'vue/multi-word-component-names': 'off',

			// allow variables / arguments / caught errors / rest siblings
			// properties to be unused as long as prepended with an underscore.
			// not having this on is annoying when just wanting to use some parameters
			// passed to a function and not all of them.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_', // ignore unused function arguments starting with an underscore
					varsIgnorePattern: '^_', // ignore unused variables starting with an underscore
					caughtErrorsIgnorePattern: '^_', // ignore unused caught errors starting with an underscore
					ignoreRestSiblings: true, // optionally, ignore rest siblings in object destructuring
				},
			],
		},
	},

	{
		...pluginVitest.configs.recommended,
		files: ['tests/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
	},
	skipFormatting,
);
