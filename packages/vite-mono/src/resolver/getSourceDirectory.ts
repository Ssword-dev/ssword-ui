import path from 'node:path';
import fs from 'node:fs';
import { loadModule } from '../loader/loadModule';
import { loadPackageJSON } from '../core/package';
import { formatAndLog } from '../core/utils';
import type { Compilation, ViteMonoWorkspaceConfig } from '../core/types';

export async function getSourceDirectory(
	comp: Compilation,
	workspaceName: string,
	workspacePath: string,
) {
	let source: string | null = null;

	// 1) workspace-level vite-mono.workspace.* config
	try {
		const workspaceCfg = await loadModule<ViteMonoWorkspaceConfig>(
			workspacePath,
			'vite-mono.workspace.{js,ts,json,jsx,tsx}',
		);
		if (workspaceCfg && typeof workspaceCfg.source === 'string' && workspaceCfg.source.length > 0) {
			source = workspaceCfg.source;
		}
	} catch {
		// ignore loader errors and fallback
	}

	// 2) package.json `source` (legacy)
	if (!source) {
		try {
			const pkg = loadPackageJSON(workspacePath);
			if (pkg && typeof pkg.source === 'string' && pkg.source.length > 0) {
				source = pkg.source;
			}
		} catch {
			// ignore
		}
	}

	const popularNames = ['src', 'source', 'lib', 'lib/src'];
	const candidates = source ? [source, ...popularNames] : popularNames;
	for (const cand of candidates) {
		const candPath = path.resolve(workspacePath, cand);
		if (fs.existsSync(candPath) && fs.statSync(candPath).isDirectory()) {
			source = cand;
			break;
		}
	}

	if (!source) {
		formatAndLog(comp, "Cannot resolve the source directory for '%s'.", workspaceName);
		return null;
	}

	return source;
}
