import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
/* no fileURLToPath required here */
import fg from 'fast-glob';
import { Loader, transform } from 'esbuild';
import require from './require';

interface ConfigurationLoader {
	load(root: string, sourceFile: string): Promise<unknown>;
}

let temp: string | null = null;

const tryMakeTemp = async () => {
	if (temp) return;

	const salt = crypto.randomBytes(3).toString('hex');
	const tempFolder = `temp-${salt}`;

	temp = await fs.mkdtemp(tempFolder);
};

const sha256 = (pt: string) => crypto.createHash('sha256').update(pt).digest();

const importRawCode = async (code: string) => {
	const hash = sha256(code);
	const fileName = `temp-${hash}.js`;

	await tryMakeTemp();

	const absolutePath = path.join(temp!, fileName);

	await fs.writeFile(absolutePath, code, {
		encoding: 'utf-8',
	});

	return require(absolutePath);
};

const createJavascriptLoader = (): ConfigurationLoader => ({
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

const createLoaderWithESBuildLoader = (loader: Loader): ConfigurationLoader => ({
	async load(root: string, sourceFile: string) {
		const absPath = path.resolve(root, sourceFile);

		const code = await fs.readFile(absPath, {
			encoding: 'utf-8',
		});

		const { code: transpiledCode } = await transform(code, {
			loader,
			minify: true,
		});

		return importRawCode(transpiledCode);
	},
});

const JavascriptLoader = createJavascriptLoader();
const JavascriptXMLLoader = createLoaderWithESBuildLoader('jsx');
const JSONLoader = createLoaderWithESBuildLoader('json');
const TypescriptLoader = createLoaderWithESBuildLoader('ts');
const TypescriptXMLLoader = createLoaderWithESBuildLoader('tsx');

const loaders: Record<string, ConfigurationLoader | null> = {
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
export async function loadConfigurationFromFile<CT>(
	root: string,
	pattern: string | string[],
): Promise<CT | null> {
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
