import * as path from 'path';
import { posix } from 'path';

// typescript
import * as ts from 'typescript';

// nx
import { formatFiles, getProjects, Tree } from '@nx/devkit';

// schema
import { ComponentGeneratorSchema } from './schema';

import { createTemplateHelpers } from './templateHelpers';
import { camelCase, pascalCase } from 'change-case';

function normalizeWeirdWindowsPaths(p: string) {
	return posix.join(p);
}

function isRelative(p: string) {
	return /^(\.\/|\.\.\/)/.test(normalizeWeirdWindowsPaths(p));
}

interface ComponentFileOptions {
	forward?: boolean;
	asChild?: boolean;
	variants?: boolean;
	componentName: string;
}

function createComponentFile({
	forward = false,
	asChild = false,
	variants = false,
	componentName,
}: ComponentFileOptions) {
	const componentExportName = pascalCase(componentName);
	const { lines } = createTemplateHelpers();
	const typeImports = [
		forward && 'RefType',
		'Props',
		'ClassProps',
		asChild && 'AsChildProps',
		variants && 'VariantProps',
	].filter(Boolean);
	const propTypeBases = [
		'Props<ComponentBase>',
		'ClassProps',
		asChild && 'AsChildProps',
		variants && `VariantProps<typeof ${componentName}VM>`,
	].filter(Boolean);
	const reactImports = [forward && 'forwardRef'].filter(Boolean);

	function conditionalImports() {
		return lines(
			"import { Slot } from '@radix-ui/react-slot';",
			`import { ${['cn', variants && 'cvm']
				.filter(Boolean)
				.join(', ')} } from '@ssword/utils-dom';`,
		);
	}

	function componentConfiguration() {
		return lines(
			"const base = 'div';",
			'',
			'type ComponentBase = typeof base',
			'',
			...(variants
				? [
						`const ${componentName}VM = cvm('', {`,
						'\tvariants: {},',
						'\tdefaultVariants: {},',
						'\tcompoundVariants: []',
						'});',
					]
				: []),
		);
	}

	function componentPropsInterface() {
		return `interface ${componentExportName}Props extends ${propTypeBases.join(', ')} {}`;
	}

	function renderFunction() {
		return lines(
			'(',
			`props: ${componentExportName}Props,`,
			forward ? 'forwardedRef' : '',
			') => {',
			`const { ${['className', asChild && 'asChild = false'].filter(Boolean).join(', ')}, ...restProps } = props;`,
			`const Comp = ${asChild ? 'asChild ? Slot : base' : 'base'};`,
			'return (',
			'<Comp',
			'{...restProps}',
			forward && 'ref={forwardedRef}',
			'className={',
			`cn(${[variants && `${componentName}VM({})`, 'className'].filter(Boolean).join(',')})`,
			'}',
			'>',
			'{props.children}',
			'</Comp>',
			');',
			'}',
		);
	}
	return lines(
		"'use client'",

		`import React, { ${reactImports.join(', ')} } from 'react';`,
		'',
		conditionalImports(),
		'',
		`import type { ${typeImports.join(', ')} } from './types.ts';`,
		'',
		componentConfiguration(),
		'',
		componentPropsInterface(),
		'',
		`const ${componentExportName} =`,
		`${forward ? `forwardRef<RefType<ComponentBase>, ${componentExportName}Props>(${renderFunction()})` : renderFunction()}`,
		'',
		`export default ${componentExportName};`,
		`export type { ${componentExportName}Props as Props };`,
	);
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

export function getProjectRoot(tree: Tree, projectName: string) {
	const projects = getProjects(tree);
	const project = projects.get(projectName);
	if (!project) throw new Error(`Project ${projectName} not found`);
	return project.root;
}

function generateComponents(tree: Tree, options: ComponentGeneratorSchema) {
	const { project, components, ...templateOptions } = options;
	const projectDir = getProjectRoot(tree, project);
	const componentsDir = path.join(projectDir, 'src', 'components');

	for (const component of components) {
		tree.write(
			path.join(componentsDir, pascalCase(component) + '.tsx'),
			createComponentFile({ ...templateOptions, componentName: camelCase(component) }),
		);
	}

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
	const projectDir = getProjectRoot(tree, project);
	const componentsDir = path.join(projectDir, 'src', 'components');

	const componentsBarrelFile = path.join(componentsDir, 'index.ts');

	if (!tree.exists(componentsBarrelFile)) {
		tree.write(componentsBarrelFile, '');
	}
	return Promise.resolve();
}

function tryUpdateBarrelFile(tree: Tree, options: ComponentGeneratorSchema) {
	const { project, components } = options;
	const projectDir = getProjectRoot(tree, project);
	const componentsDir = path.join(projectDir, 'src', 'components');

	const componentsBarrelFile = path.join(componentsDir, 'index.ts');

	if (!tree.exists(componentsBarrelFile)) {
		console.warn(`Barrel file not found at ${componentsBarrelFile}`);
		return Promise.resolve();
	}

	const barrelSourceFileContent = tree.read(componentsBarrelFile, 'utf-8');

	if (!barrelSourceFileContent || barrelSourceFileContent.trim() === '') {
		const newExports = components.map((comp) => createComponentExport(comp));
		const printer = ts.createPrinter();
		const newBarrelSourceCode = printer.printFile(
			ts.factory.createSourceFile(
				[...newExports],
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

	const oldExports = new Set(
		barrelSourceFile.statements
			.filter(ts.isExportDeclaration)
			.map(
				(exports) =>
					exports.moduleSpecifier &&
					ts.isStringLiteral(exports.moduleSpecifier) &&
					exports.moduleSpecifier.text,
			)
			.filter(Boolean),
	);
	const newExports = components
		.filter((component) => !oldExports.has(component))
		.map((component) => createComponentExport(component));

	const updatedSourceFile = ts.factory.updateSourceFile(
		barrelSourceFile,
		[...barrelSourceFile.statements, ...newExports],
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
	console.log(JSON.stringify(options, null, 2));
	await generateComponents(tree, options);
	await tryCreateBarrelFile(tree, options);
	await tryUpdateBarrelFile(tree, options);
	await formatFiles(tree);
}

export default componentGenerator;
