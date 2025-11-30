import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

const external = (id) => {
	if (id.startsWith('.') || id.startsWith('/')) return false;
	return true;
};

/**
 * @returns {import("rollup").Config[]}
 */
export const LibraryConfig = ({ input, pkg }) => {
	return [
		{
			input,
			external,
			plugins: [
				esbuild({
					target: 'esnext',
					tsconfig: 'tsconfig.json',
					jsxFactory: 'React.Element',
					jsxFragment: 'React.Fragment',
				}),
			],
			output: [
				{
					file: pkg.module,
					format: 'esm',

					sourcemap: true,
				},
				{
					file: pkg.main,
					format: 'cjs',
					sourcemap: true,
					exports: 'named',
				},
			],
		},

		// types
		{
			input,
			plugins: [dts()],
			external,
			output: {
				file: pkg.types,
				format: 'esm',
			},
		},
	];
};
