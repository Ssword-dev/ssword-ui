import { Tree, generateFiles, formatFiles, joinPathFragments, names } from '@nx/devkit';

export default async function (tree: Tree, options: any) {
	const parsed = names(options.name);

	const outDir = joinPathFragments(options.path, parsed.fileName);

	generateFiles(tree, joinPathFragments(__dirname, 'files'), outDir, {
		...options,
		...parsed,
	});

	await formatFiles(tree);
}
