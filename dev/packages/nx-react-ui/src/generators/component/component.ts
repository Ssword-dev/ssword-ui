import { addProjectConfiguration, formatFiles, generateFiles, names, Tree } from '@nx/devkit';
import { join } from 'path';
import { ComponentGeneratorSchema } from './schema';
import { pascalCase, camelCase } from 'change-case';

export async function componentGenerator(
	tree: Tree,
	options: ComponentGeneratorSchema,
): Promise<void> {
	const { project, name, ...templateOptions } = options;

	const componentsDir = join(project, 'src', 'components');

	generateFiles(tree, join(__dirname, 'files'), componentsDir, {
		...templateOptions,
		name: pascalCase(options.name),
		componentExportName: pascalCase(name),
		componentName: camelCase(options.name),
	});

	await formatFiles(tree);
}

export default componentGenerator;
