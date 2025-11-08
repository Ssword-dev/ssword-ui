import { defineConfig, type PluginOption } from 'vite';
import { isBuiltin } from 'node:module';
import path from 'node:path';

const shebangGenerator: PluginOption = {
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

export default defineConfig({
	build: {
		lib: {
			entry: 'src/cli.ts',
			formats: ['es'],
			fileName: () => `cli.js`,
		},
		sourcemap: true,
		terserOptions: {},
		rollupOptions: {
			external: (id) =>
				!id.startsWith('.') && !path.isAbsolute(id) && (isBuiltin(id) || /vite/.test(id)),
		},
		target: 'node16',
		ssr: true,
	},
	plugins: [shebangGenerator],
	resolve: {
		conditions: ['import', 'node'],
	},
});
