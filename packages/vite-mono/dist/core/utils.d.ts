import type { Compilation } from './types';
import { PackageJSON } from '../schema/package-json.schema';
export declare const messages: {
    'config-not-found': string;
    'config-resolution-error': string;
    'source-resolution-error': string;
};
export declare function readPackageJSON(dir: string): PackageJSON;
export declare const globFiles: (root: string, pattern: string | string[]) => Promise<string[]>;
export declare const globFile: (...args: Parameters<typeof globFiles>) => Promise<string>;
export declare function formatAndLog(comp: Compilation, fmt: string, ...params: string[]): void;
