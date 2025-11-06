import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import fg from 'fast-glob';
import { Loader, transform } from 'esbuild';
import require from './require';
import { fileURLToPath } from 'node:url';

// proxy __filename and __dirname globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// an object containing all the  impure states
// of the script loader.
const impureState = {
	temp: null as string | null,
	cleanupHooked: false,
};

interface ModuleLoader {
	load(root: string, sourceFile: string): Promise<unknown>;
}

const tryMakeTemp = async () => {
	if (impureState.temp) return;

	const suffix = crypto.randomBytes(3).toString('hex');
	const tempDir = path.join(__dirname, `transpiled-${suffix}`);

	impureState.temp = tempDir;

	await fs.mkdir(tempDir, {
		recursive: true,
	});

	// after making temp folder for the transpiled scripts,
	// try hooking into node's lifecycle to attatch cleanup to
	// properly cleanup the temporary folder.
	tryHookCleanupIntoNodeLifecycle();
};

const tryDeleteTemp = async () => {
	if (!impureState.temp) return;

	try {
		await fs.rm(impureState.temp, {
			recursive: true,
			force: true,
		});
	} catch (_) {
		/* pass */
	}
};

const cleanup = async () => {
	await tryDeleteTemp();
};

const tryHookCleanupIntoNodeLifecycle = () => {
	// only hook once.
	if (impureState.cleanupHooked) return;

	// enable the flag to sign to further calls that
	// the hook is already installed.
	impureState.cleanupHooked = true;

	// attach into node's lifecycle.
	process.on('beforeExit', () => {
		cleanup();
	});
};

const sha256 = (pt: string) => crypto.createHash('sha256').update(pt).digest().toString('hex');

const importRawCode = async (code: string) => {
	const hash = sha256(code);
	const fileName = `temp-${hash}.js`;

	await tryMakeTemp();

	const absolutePath = path.join(impureState.temp!, fileName);

	await fs.writeFile(absolutePath, code, {
		encoding: 'utf-8',
	});

	return require(absolutePath);
};

const createJavascriptLoader = (): ModuleLoader => ({
	async load(root, sourceFile) {
		const resolved = path.resolve(root, sourceFile);

		try {
			return require(resolved);
		} catch (anyErrorForCommonJSImport) {
			try {
				return await import(resolved);
			} catch (anyErrorForESModuleImport) {
				throw new Error(
					`Failed to load module "${resolved}": CommonJS require error: ${String(anyErrorForCommonJSImport)}; ESM import error: ${String(anyErrorForESModuleImport)}`,
				);
			}
		}
	},
});

const createLoaderWithESBuildLoader = (loader: Loader): ScriptLoader => ({
	async load(root: string, sourceFile: string) {
		const absPath = path.resolve(root, sourceFile);

		const code = await fs.readFile(absPath, {
			encoding: 'utf-8',
		});

		const { code: transpiledCode } = await transform(code, {
			loader,
			minify: true,
			sourcefile: absPath,
		});

		return importRawCode(transpiledCode);
	},
});

// loaders
// these loaders actually implement the rest of the logic
// for loading modules.
const JavascriptLoader = createJavascriptLoader();
const JavascriptXMLLoader = createLoaderWithESBuildLoader('jsx');
const JSONLoader: ModuleLoader = {
	async load(root: string, sourceFile: string) {
		const absPath = path.resolve(root, sourceFile);
		const code = await fs.readFile(absPath, { encoding: 'utf-8' });
		return JSON.parse(code);
	},
};
const TypescriptLoader = createLoaderWithESBuildLoader('ts');
const TypescriptXMLLoader = createLoaderWithESBuildLoader('tsx');

// a map of loaders to define what to use for loading
// specific loaders.
const loaders: Record<string, ModuleLoader | null> = {
	js: JavascriptLoader,
	jsx: JavascriptXMLLoader,
	json: JSONLoader,
	ts: TypescriptLoader,
	tsx: TypescriptXMLLoader,
};

/**
 * Find the first file that matches the given pattern(s) under `root` and load it
 * using the appropriate loader based on file extension.
 * Returns the loaded configuration or null when none found.
 */
export async function loadModule<CT>(root: string, pattern: string | string[]): Promise<CT | null> {
	const patterns = Array.isArray(pattern) ? pattern : [pattern];

	const entries = await fg(patterns, {
		cwd: root,
		onlyFiles: true,
		absolute: true,
		braceExpansion: true,
		globstar: true,
	});
	const file = entries[0];
	if (!file) return null;

	const ext = path.extname(file).replace(/^\./, '');
	const loader = loaders[ext];
	if (!loader) {
		throw new Error(`Unsupported configuration file extension: .${ext}`);
	}

	// loader.load accepts (root, sourceFile). Pass absolute path so loaders that call
	// path.resolve(root, sourceFile) still work correctly.
	const result = await loader.load(root, file);
	return result as CT;
}
