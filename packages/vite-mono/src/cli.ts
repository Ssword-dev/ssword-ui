import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ViteMono, ViteMonoConfig } from './vite-mono';
import require from './require';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function bootstrap() {
	const args = await yargs(hideBin(process.argv))
		.option('config', {
			alias: 'c',
			type: 'string',
			default: 'vite-mono.config.js',
			description: 'Path to config file',
		})
		.parseAsync();

	// current working directory
	const cwd = process.cwd();

	// the actual config path relative to the current working
	// directory.
	const configPath = args.config || 'vite-mono.config.js';

	// resolve the actual path.
	const vmConfigPath = path.resolve(cwd, configPath);

	// load config - support both CommonJS (require) and ESM (dynamic import)
	let vmConfig: ViteMonoConfig | undefined;
	try {
		// attempt to require (works for CJS and some transpiled modules)
		const loaded = require(vmConfigPath);
		vmConfig = loaded && loaded.__esModule && loaded.default ? loaded.default : loaded;
	} catch {
		// fallback to dynamic import for ESM configs
		const fileUrl = pathToFileURL(vmConfigPath).href;
		const imported = await import(fileUrl);
		vmConfig = imported.default ?? imported;
	}

	if (!vmConfig || typeof vmConfig.root !== 'string') {
		throw new TypeError(
			`Invalid ViteMono config loaded from ${vmConfigPath}. Expected an object with a string 'root' property.`,
		);
	}

	const vm = new ViteMono(vmConfig as ViteMonoConfig);

	// build
	await vm.build();
}

bootstrap().catch(console.error);
