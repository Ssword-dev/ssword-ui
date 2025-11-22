import { workspacePackages } from './config-utils.mjs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WithNxOptions } from '@nx/next/plugins/with-nx';
import { composePlugins, withNx } from '@nx/next';

const config: WithNxOptions = {
	nx: {
		babelUpwardRootMode: true,
	},

	reactCompiler: true,

	transpilePackages: ['@ssword-ui/react', '@ssword/utils'],

	experimental: {
		externalDir: true,
	},
};

const plugins = [withNx];

export default composePlugins(...plugins)(config);
