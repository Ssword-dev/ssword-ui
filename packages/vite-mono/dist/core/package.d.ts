import { type PackageJSON } from '../schema/package-json.schema';
/**
 * Load a package.json for a package name or an absolute directory path.
 * - If `nameOrPath` is an absolute path, will load `<nameOrPath>/package.json`.
 * - Otherwise, will attempt to require `${nameOrPath}/package.json` using the project's
 *   createRequire helper so Node resolution rules and PnP work.
 * Returns `null` if the package.json could not be loaded.
 */
export declare function loadPackageJSON(nameOrPath: string): PackageJSON | null;
