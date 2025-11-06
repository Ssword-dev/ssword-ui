import path from 'node:path';
import fs from 'node:fs';
import { z } from 'zod';
import require from './require';
import { isBuiltin } from 'node:module';
import semverValid from 'semver/functions/valid';
import { type PackageJSON, PackageJSONSchema } from '../schema/package-json.schema';
import { validate } from './validate';

/**
 * Load a package.json for a package name or an absolute directory path.
 * - If `nameOrPath` is an absolute path, will load `<nameOrPath>/package.json`.
 * - Otherwise, will attempt to require `${nameOrPath}/package.json` using the project's
 *   createRequire helper so Node resolution rules and PnP work.
 * Returns `null` if the package.json could not be loaded.
 */
export function loadPackageJSON(nameOrPath: string): PackageJSON | null {
	if (path.isAbsolute(nameOrPath)) {
		const pkgPath = path.resolve(nameOrPath, './package.json');
		if (!fs.existsSync(pkgPath)) return null;
		const raw = fs.readFileSync(pkgPath, { encoding: 'utf-8' });
		const pkg = JSON.parse(raw) as unknown;

		if (!validate(pkg, PackageJSONSchema)) {
			throw new Error('Invalid package.json error.');
		}
	}
	try {
		// treat as package name and resolve via require
		return require(path.join(nameOrPath, 'package.json')) as PackageJSON;
	} catch {
		return null;
	}
}
