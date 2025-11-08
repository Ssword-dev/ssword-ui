import { build as viteBuild } from 'vite';
import { getAllWorkspaceEntries } from '../resolver/getAllWorkspaceEntries';
import { getAllWorkspaces } from '../resolver/getAllWorkspaces';
import { getWorkspaceBindingAliasMap, finalAliasMapFor } from './alias';
import type { Compilation } from './types';

export async function buildWorkspaces(comp: Compilation) {
	try {
		const entries = await getAllWorkspaceEntries(
			comp.context.root,
			await (comp.context.package ?? Promise.resolve({} as any)),
		);

		const workspaces = await getAllWorkspaces(comp, entries);
		const workspaceBindingAliasMap = getWorkspaceBindingAliasMap(comp, workspaces);

		for (const workspace of workspaces) {
			const mergedResolve = {
				...(workspace.config.resolve ?? {}),
				alias: {
					...(workspace.config.resolve?.alias ?? {}),
					...finalAliasMapFor(workspace, workspaceBindingAliasMap),
				},
			};

			await viteBuild({
				...workspace.config,
				root: workspace.root,
				resolve: mergedResolve,
				forceOptimizeDeps: true,
				configFile: workspace.configFile,
				logLevel: 'silent',
			});
		}
	} catch (e) {
		comp.logger.error(String(e));
	}
}
