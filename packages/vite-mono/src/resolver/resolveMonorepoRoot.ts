import fg from 'fast-glob';
import path from 'node:path';

export async function resolveMonorepoRoot(start: string): Promise<string | null> {
	let root = start;

	// while(true) here is for granular control
	// of when to break the loop inside the body.
	// this breaks if a monolith configuration has been
	// found or we reached the last directory of depth = 0;
	// expressed as '' with no drive letter.
	while (true) {
		const monolithConfig = await fg(['vite-mono-root.config.{js,cjs,mjs,cts,mts'], {
			cwd: root,
			onlyFiles: true,
		});

		if (monolithConfig.length) {
			return root;
		}

		root = path.dirname(root);

		if (!root) {
			break;
		}
	}

	return null;
}
