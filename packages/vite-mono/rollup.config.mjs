import { isBuiltin } from 'node:module';
import path from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const shebangPlugin = {
	name: 'shebang-generator',
	generateBundle(options, bundle) {
		for (const fileName in bundle) {
			const file = bundle[fileName];
			if (file.type === 'chunk') {
				file.code = '#!/usr/bin/env node\n' + file.code;
			}
		}
	},
};

export default {
	input: 'src/cli.ts',
	external: (id) =>
		!id.startsWith('.') && !path.isAbsolute(id) && (isBuiltin(id) || /vite/.test(id)),
	plugins: [
		resolve({ preferBuiltins: true, exportConditions: ['import', 'node'] }),
		commonjs(),
		typescript({ sourceMap: true }),
		terser(),
		shebangPlugin,
	],
	output: {
		file: 'dist/cli.js',
		format: 'es',
		sourcemap: true,
	},
};
