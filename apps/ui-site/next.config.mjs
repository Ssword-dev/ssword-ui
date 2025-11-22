import { workspacePackages } from './config-utils.mjs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function nextConfig() {
	return {
		reactCompiler: true,

		transpilePackages: ['@ssword-ui/react', '@ssword/utils'],

		experimental: {
			externalDir: true,
		},
	};
}
