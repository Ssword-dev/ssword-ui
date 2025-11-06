import path from 'node:path';
import Logger from './logger';
import { readPackageJSON } from './utils';
import type { Compilation, CompilationContext, ViteMonoConfig } from './types';

export function createCompilation(options: ViteMonoConfig): Compilation {
	const root = path.resolve(process.cwd(), options.root);
	const logger = new Logger();
	const context: CompilationContext = {
		root,
		package: Promise.resolve(readPackageJSON(root)),
		temp: null,
		cleanupHooked: false,
	};

	return { context, logger };
}
