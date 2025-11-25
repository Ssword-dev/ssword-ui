import * as ts from 'typescript';
import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { posix } from 'path';
import { ComponentGeneratorSchema } from './schema';
import { pascalCase, camelCase } from 'change-case';

function normalizeWeirdWindowsPaths(p: string) {
	return posix.join(p);
}

function isRelative(p: string) {
	return /^(\.\/|\.\.\/)/.test(normalizeWeirdWindowsPaths(p));
}

function sortExportsAlphabetically(source: ts.SourceFile): ts.SourceFile {
	const exports = source.statements.filter(ts.isExportDeclaration);
	const otherStatements = source.statements.filter((node) => !ts.isExportDeclaration(node));

	const nonRelativeExports: ts.ExportDeclaration[] = [];
	const relativeExports: ts.ExportDeclaration[] = [];

	exports.forEach((exportDecl) => {
		if (exportDecl.moduleSpecifier && ts.isStringLiteral(exportDecl.moduleSpecifier)) {
			if (isRelative(exportDecl.moduleSpecifier.text)) {
				relativeExports.push(exportDecl);
			} else {
				nonRelativeExports.push(exportDecl);
			}
		} else {
			relativeExports.push(exportDecl);
		}
	});

	relativeExports.sort((a, b) => {
		const getSortKey = (node: ts.ExportDeclaration): string => {
			if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
				return path.basename(node.moduleSpecifier.text);
			}
			return '';
		};

		return getSortKey(a).localeCompare(getSortKey(b));
	});

	nonRelativeExports.sort((a, b) => {
		const getSortKey = (node: ts.ExportDeclaration): string => {
			if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
				return node.moduleSpecifier.text;
			}
			return '';
		};

		return getSortKey(a).localeCompare(getSortKey(b));
	});

	const newStatements = [...otherStatements, ...nonRelativeExports, ...relativeExports];

	return ts.factory.updateSourceFile(
		source,
		newStatements,
		source.isDeclarationFile,
		source.referencedFiles,
		source.typeReferenceDirectives,
		source.hasNoDefaultLib,
		source.libReferenceDirectives,
	);
}

function generateComponent(tree: Tree, options: ComponentGeneratorSchema) {
	const { project, name, ...templateOptions } = options;
	const componentsDir = path.join(project, 'src', 'components');

	generateFiles(tree, path.join(__dirname, 'files'), componentsDir, {
		...templateOptions,
		name: pascalCase(options.name),
		componentExportName: pascalCase(name),
		componentName: camelCase(options.name),
	});

	return Promise.resolve();
}

function createComponentExport(name: string): ts.ExportDeclaration {
	const componentName = pascalCase(name);
	const propsName = `${componentName}Props`;

	return ts.factory.createExportDeclaration(
		undefined,
		false,
		ts.factory.createNamedExports([
			ts.factory.createExportSpecifier(
				false,
				ts.factory.createIdentifier('default'),
				ts.factory.createIdentifier(componentName),
			),
			ts.factory.createExportSpecifier(
				true,
				ts.factory.createIdentifier('Props'),
				ts.factory.createIdentifier(propsName),
			),
		]),
		ts.factory.createStringLiteral(`./${componentName}`),
	);
}

function tryCreateBarrelFile(tree: Tree, options: ComponentGeneratorSchema) {
	const { project } = options;
	const componentsDir = path.join(project, 'src', 'components');
	const componentsBarrelFile = path.join(componentsDir, 'index.ts');

	if (!tree.exists(componentsBarrelFile)) {
		tree.write(componentsBarrelFile, '');
	}
	return Promise.resolve();
}

function tryUpdateBarrelFile(tree: Tree, options: ComponentGeneratorSchema) {
	const { project, name } = options;
	const componentsDir = path.join(project, 'src', 'components');
	const componentsBarrelFile = path.join(componentsDir, 'index.ts');

	if (!tree.exists(componentsBarrelFile)) {
		console.warn(`Barrel file not found at ${componentsBarrelFile}`);
		return Promise.resolve();
	}

	const barrelSourceFileContent = tree.read(componentsBarrelFile, 'utf-8');

	if (!barrelSourceFileContent || barrelSourceFileContent.trim() === '') {
		const newExport = createComponentExport(name);
		const printer = ts.createPrinter();
		const newBarrelSourceCode = printer.printFile(
			ts.factory.createSourceFile(
				[newExport],
				ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
				ts.NodeFlags.None,
			),
		);
		tree.write(componentsBarrelFile, newBarrelSourceCode);
		return Promise.resolve();
	}

	const barrelSourceFile = ts.createSourceFile(
		'index.ts',
		barrelSourceFileContent,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);

	const componentName = pascalCase(name);
	const exportAlreadyExists = barrelSourceFile.statements.some((statement) => {
		if (
			ts.isExportDeclaration(statement) &&
			statement.moduleSpecifier &&
			ts.isStringLiteral(statement.moduleSpecifier)
		) {
			return statement.moduleSpecifier.text === `./${componentName}`;
		}
		return false;
	});

	if (exportAlreadyExists) {
		console.log(`Export for ${componentName} already exists in barrel file`);
		return Promise.resolve();
	}

	const updatedSourceFile = ts.factory.updateSourceFile(
		barrelSourceFile,
		[...barrelSourceFile.statements, createComponentExport(name)],
		false,
		barrelSourceFile.referencedFiles,
		barrelSourceFile.typeReferenceDirectives,
		barrelSourceFile.hasNoDefaultLib,
		barrelSourceFile.libReferenceDirectives,
	);

	const sortedSourceFile = sortExportsAlphabetically(updatedSourceFile);
	const printer = ts.createPrinter();
	const newBarrelSourceCode = printer.printFile(sortedSourceFile);

	tree.write(componentsBarrelFile, newBarrelSourceCode);
	return Promise.resolve();
}

export async function componentGenerator(
	tree: Tree,
	options: ComponentGeneratorSchema,
): Promise<void> {
	await generateComponent(tree, options);
	await tryCreateBarrelFile(tree, options);
	await tryUpdateBarrelFile(tree, options);
	await formatFiles(tree);
}

export default componentGenerator;
