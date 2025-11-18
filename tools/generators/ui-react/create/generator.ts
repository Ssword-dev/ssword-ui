import { Generator, Tree } from '@nx/devkit';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

interface Options {
	sc: string; // subcommand
	[K: string]: string;
}

export default async function create(tree: Tree, options: Options) {
	const { sc, ...opts } = options;

	if (sc === 'create') {
		throw new Error(
			'Cannot invoke create with subcommand `create`. this is recursive and may lead to undefined behaviour.',
		);
	}

	const generatorPath = fileURLToPath(import.meta.url);
	const generatorRoot = dirname(generatorPath);

	const collectionPath = join(generatorPath, 'generators.json');
	const childGeneratorDirectory = join(generatorRoot, sc);
	const childGeneratorFile = join(childGeneratorDirectory, 'generator.ts');

	let exports: Record<string | symbol, any>, generator: Generator;

	try {
		const childGeneratorURL = pathToFileURL(childGeneratorFile).href;
		exports = await import(childGeneratorURL);
	} catch (e) {
		throw new Error(`Failed to import generator file due to error: ${e}`);
	}

	switch (true) {
		case 'default' in exports: {
			generator = exports.default;
			break;
		}

		case 'generator' in exports: {
			generator = exports.generator;
			break;
		}

		default: {
			const firstFunctionExport = Object.keys(exports).find(
				(k) => typeof exports[k] === 'function',
			);

			if (!firstFunctionExport) {
				throw new Error(
					`Failed to resolve a generator function from subcommand source file ${childGeneratorFile}`,
				);
			}

			generator = exports[firstFunctionExport];
		}
	}

	await generator(tree, opts);
}
