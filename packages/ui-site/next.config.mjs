import { workspacePackages } from './config-utils.mjs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function nextConfig() {
	const packages = await workspacePackages(dirname(dirname(__dirname)));
	return {
		reactCompiler: true,

		transpilePackages: packages,
	};
}
