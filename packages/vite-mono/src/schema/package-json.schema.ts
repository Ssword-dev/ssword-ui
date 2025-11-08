import { z } from 'zod';
import { isBuiltin } from 'node:module';
import semverValid from 'semver/functions/valid';
import { JSONSchema } from './json.schema';

const PackageSemVerSchema = z.string().superRefine((ver, context) => {
	const validity = semverValid(ver);

	if (!validity) {
		context.addIssue({
			code: 'custom',
			message: 'Invalid Semantic Version',
			input: ver,
		});
	}
});

// matches @scope/name or name
const PackageNameSchema = z
	.string()
	.min(1)
	.max(214)
	.superRefine((name, context) => {
		if (isBuiltin(name)) {
			context.addIssue({
				code: 'custom',
				message: 'Cannot use a built in node module name.',
			});
		}

		if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)) {
			context.addIssue({
				code: 'custom',
				message: 'packages should  adhere to the npm package spec.',
			});
		}
	});

const ModuleTypeSchema = z.enum(['module', 'commonjs']);

// Schema for RepositoryObject
const RepositoryObjectSchema = z.object({
	type: z.string().optional(),
	url: z.string().optional(),
	directory: z.string().optional(),
});

// Schema for RepositoryField (string or RepositoryObject)
const RepositoryFieldSchema = z.union([z.string(), RepositoryObjectSchema]);

// Schema for BugsField

const BugsFieldSchema = z.object({
	url: z.string().optional(),
	email: z.string().optional(),
});

const PersonObjectSchema = z.object({
	name: z.string(),
	email: z.string().optional(),
	url: z.string().optional(),
});

// schema for a person (string or object)
// usually
const PersonSchema = z.union([z.string(), PersonObjectSchema]);

// schema for DependenciesMap and similar record types
const DependenciesMapSchema = z.record(z.string(), z.string());

type ExportFieldType = string | ExportFieldMap;

interface ExportFieldMap {
	[key: string]: ExportFieldType | ExportFieldMap;
}

// schema for complex nested ExportsField
const ExportsFieldSchema: z.ZodType<ExportFieldType> = z.lazy(() =>
	z.union([
		z.string(),
		z.record(z.string(), z.union([ExportsFieldSchema, z.record(z.string(), ExportsFieldSchema)])),
	]),
);

// Schema for WorkspacesField
const WorkspacesFieldSchema = z.union([
	z.array(z.string()),
	z.object({
		packages: z.array(z.string()),
		nohoist: z.array(z.string()).optional(),
	}),
]);

// Main PackageJSON schema
export const PackageJSONSchema = z
	.object({
		// Identity
		name: PackageNameSchema.optional(),
		version: PackageSemVerSchema.optional(),
		private: z.boolean().optional(),
		type: ModuleTypeSchema.optional(),

		// Descriptive fields
		description: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		homepage: z.string().optional(),
		repository: RepositoryFieldSchema.optional(),
		bugs: BugsFieldSchema.optional(),
		license: z.string().optional(),

		// People
		author: PersonSchema.optional(),
		contributors: z.array(PersonSchema).optional(),
		maintainers: z.array(PersonSchema).optional(),

		// Entry points & files
		main: z.string().optional(),
		module: z.string().optional(),
		browser: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
		types: z.string().optional(),
		typings: z.string().optional(),
		files: z.array(z.string()).optional(),
		exports: z.union([ExportsFieldSchema, z.record(z.string(), ExportsFieldSchema)]).optional(),
		bin: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
		man: z.union([z.string(), z.array(z.string())]).optional(),

		// Dependency fields
		dependencies: DependenciesMapSchema.optional(),
		devDependencies: DependenciesMapSchema.optional(),
		peerDependencies: DependenciesMapSchema.optional(),
		optionalDependencies: DependenciesMapSchema.optional(),
		bundledDependencies: z.array(z.string()).optional(),
		bundleDependencies: z.array(z.string()).optional(),

		// Workspaces / monorepo
		workspaces: WorkspacesFieldSchema.optional(),
	})
	.catchall(JSONSchema); /** allow arbitrary JSON values. */

export type PackageJSON = z.infer<typeof PackageJSONSchema>;
