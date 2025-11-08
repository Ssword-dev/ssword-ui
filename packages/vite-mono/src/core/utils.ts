import fg from 'fast-glob';
import { format } from 'node:util';
import { loadPackageJSON } from './package';
import type { Compilation } from './types';
import { PackageJSON } from '../schema/package-json.schema';

export const messages = {
	'config-not-found':
		"A Vite Config is required for workspace '%s' to be built. skipping workspace '%s' due to missing configuration...",
	'config-resolution-error': "An error occured while resolving a configuration for workspace '%s'.",
	'source-resolution-error': "Cannot resolve the source directory for '%s'.",
};

export function readPackageJSON(dir: string): PackageJSON {
	return loadPackageJSON(dir) ?? {};
}

export const globFiles = (root: string, pattern: string | string[]) =>
	fg(pattern, {
		cwd: root,
		onlyFiles: true,
		braceExpansion: true,
		globstar: true,
		absolute: true,
	});

export const globFile = (...args: Parameters<typeof globFiles>) =>
	globFiles(...args).then((entries) => entries[0] ?? null);

export function formatAndLog(comp: Compilation, fmt: string, ...params: string[]) {
	comp.logger.log(format(fmt, ...(params as string[])));
}
