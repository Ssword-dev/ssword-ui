import nx from '@nx/eslint-plugin';

function withDefault(val, defaultValue) {
	return val ?? defaultValue;
}

export function createWorkspaceRootConfig(options = {}) {
	const ignores = withDefault(options.ignores, [
		'**/dist',
		'**/coverage',
		'**/build',
		'**/.nx',
		'**/.git',
		'node_modules',
	]);

	const extraRules = withDefault(options.extraRules, {});

	const nxPresets = withDefault(options.nx?.configPresets, [
		'flat/root',
		'flat/typescript',
		'flat/javascript',
	]);

	return [
		// nx root-level presets
		...nxPresets
			.map((preset) => nx.configs[preset])
			.filter(Boolean)
			.flat(),

		{
			ignores,
		},

		{
			files: ['**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}'],
			plugins: {
				'@nx': nx,
			},
			rules: {
				'@nx/enforce-module-boundaries': [
					'error',
					{
						enforceBuildableLibDependency: true,
						depConstraints: [
							{
								sourceTag: '*',
								onlyDependOnLibsWithTags: ['*'],
							},
						],
					},
				],
				...extraRules,
			},
		},
	];
}

/**
 *
 * @param {import("./config").LibraryConfigUserOptions} options
 * @returns {import("./config").LibraryConfig}
 */
export function createLibraryConfig(options = {}) {
	const nxOptions = withDefault(options.nx, {
		configPresets: [],
	});

	const configPresets = withDefault(options.configPresets, []);
	const userConfig = withDefault(options.config, {});
	const fc = [
		...nx.configs['flat/base'],
		...nx.configs['flat/typescript'],
		...nx.configs['flat/javascript'],
		...withDefault(nxOptions.configPresets, []).map((preset) => nx.configs[preset]),

		{
			plugins: {
				'@nx': nx,
			},
			files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
			rules: {
				'@nx/enforce-module-boundaries': [
					'error',
					{
						enforceBuildableLibDependency: true,
						allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
						depConstraints: [
							{
								sourceTag: '*',
								onlyDependOnLibsWithTags: ['*'],
							},
						],
					},
				],
			},
		},

		...configPresets,

		{
			...userConfig,
		},
	];

	return fc;
}

/**
 *
 * @param {import("./config").ApplicationConfigUserOptions} options
 * @returns {import("./config").ApplicationConfig}
 */
export function createApplicationConfig(options = {}) {
	return createLibraryConfig(options);
}
