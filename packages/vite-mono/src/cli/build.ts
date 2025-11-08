import { createCompilation, buildWorkspaces } from '../core';
import Logger from '../core/logger';
import { resolveMonorepoRoot } from '../resolver/resolveMonorepoRoot';

export default {
	name: 'build',
	async handler({}) {
		// current working directory
		const cwd = process.cwd();

		// this part makes it be able to run anywhere
		// and not just the project root.
		const root = await resolveMonorepoRoot(cwd);

		if (!root) {
			const logger = Logger.ofGlobal();

			logger.error(
				'Cannot resolve the root of the monorepo. Please make sure a vite-mono-root.config.{js,cjs,mjs,ts,cts,mts} exist in your project root.',
			);
			return;
		}

		const compilation = createCompilation({
			root,
		});

		await buildWorkspaces(compilation);
	},
};
