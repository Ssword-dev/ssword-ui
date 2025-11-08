import { loadConfigFromFile } from 'vite';
import { globFile, formatAndLog, messages } from '../core/utils';
import type { Compilation } from '../core/types';

export async function getBuildConfiguration(
	comp: Compilation,
	workspaceName: string,
	workspaceAbsolutePath: string,
): Promise<NonNullable<Awaited<ReturnType<typeof loadConfigFromFile>>> | null> {
	const viteConfigPath = await globFile(
		workspaceAbsolutePath,
		'vite.config.{cjs,mjs,js,cts,mts,ts}',
	);

	if (!viteConfigPath) {
		formatAndLog(comp, messages['config-not-found'], workspaceName, workspaceName);
		return null;
	}

	const configResolutionResult = await loadConfigFromFile(
		{ command: 'build', mode: 'production' },
		viteConfigPath,
		workspaceAbsolutePath,
		'silent',
		undefined,
		'runner',
	);

	if (!configResolutionResult) {
		formatAndLog(comp, messages['config-resolution-error'], workspaceName);
		return null;
	}

	return configResolutionResult;
}
