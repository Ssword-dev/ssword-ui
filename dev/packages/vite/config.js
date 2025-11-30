import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { join, dirname, isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const External = (root) => {
	const source = join(root, 'src');
	const entry = join(root, 'src', 'index.ts');

	const isInsideOf = (directory, pathToTest) => {
		if (!isAbsolute(pathToTest)) {
			return true;
		}
		const resolvedId = relative(directory, pathToTest);
		return resolvedId[0] === '.' && resolvedId[1] === sep;
	};

	return (id) => {
		console.log(id);
		if (isInsideOf(source, id)) {
			return false;
		}

		return false;
	};
};

const formatExtensions = {
	es: 'mjs',
	cjs: 'cjs',
};

/**
 * @returns {import("rollup").OutputOptions}
 */
const SharedOutputOptions = () => ({
	// preserveModules: true,
	preserveModulesRoot: 'src',
	assetFileNames: '[name].[ext]',
});

/**
 * @param {{configFile: string | URL, tsConfig?: string, overrides?: import("vite").UserConfig}} arg0
 * @returns {import("vite").UserConfig}
 */
export const defineLibraryConfig = ({
	configFile, // file url
	tsConfig = 'tsconfig.json',
	overrides = {},
}) => {
	const configPath = fileURLToPath(configFile);
	const root = dirname(configPath);
	const external = External(root);

	const { build: buildOverrides = {}, define: defineOverrides = {}, configOverrides } = overrides;
	return {
		appType: 'custom',

		build: {
			// let these be overridable.
			sourcemap: true,
			emptyOutDir: true,
			minify: false, // by default, do not minify.

			...buildOverrides,

			lib: {
				entry: join(root, 'src', 'index.ts'),
				...(buildOverrides.lib || {}),
			},

			rollupOptions: {
				plugins: [
					esbuild({
						include: /\.(ts|tsx|js|jsx)$/, // Only process these
						exclude: /\.(d\.ts|spec\.ts|test\.ts)$/, // Explicitly exclude
						tsconfig: join(root, tsConfig),
					}),
					...((buildOverrides.lib || {}).rollupOptions?.plugins || []),
					dts({
						tsconfig: join(root, tsConfig),
					}),
				],

				// output does not get merged with overrides intentionally.
				output: [
					{
						format: 'cjs',
						entryFileNames: '[name].cjs',
						...SharedOutputOptions(),
					},
					{
						format: 'es',
						entryFileNames: '[name].mjs',
						...SharedOutputOptions(),
					},
				],

				// all my libraries externalize everything.
				external,
			},
		},

		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
			...defineOverrides,
		},

		...configOverrides,
	};
};
