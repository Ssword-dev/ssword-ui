import { build as viteBuild } from 'vite';
import { getAllWorkspaceEntries } from './resolvers/discovery';
import { getAllWorkspaces } from './resolvers/workspace-resolver';
import { getWorkspaceBindingAliasMap, finalAliasMapFor } from './alias';
import type { Compilation } from './types';

export async function buildWorkspaces(comp: Compilation) {
	try {
		const entries = await getAllWorkspaceEntries(comp);

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
