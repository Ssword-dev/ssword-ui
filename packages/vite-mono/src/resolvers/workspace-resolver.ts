import { getBuildConfiguration } from '../config-resolver';
import { getSourceDirectory } from '../source-resolver';
import type { Compilation, WorkspaceEntry, Workspace } from '../types';

export async function getAllWorkspaces(
	comp: Compilation,
	workspaceEntries: WorkspaceEntry[],
): Promise<Workspace[]> {
	const workspaces: (Workspace | null)[] = await Promise.all(
		workspaceEntries.map(async ([workspaceName, workspacePath]) => {
			const configResolutionResult = await getBuildConfiguration(
				comp,
				workspaceName,
				workspacePath,
			);

			if (!configResolutionResult) {
				return null;
			}

			const { config, path: viteConfigPath } = configResolutionResult;

			const source = await getSourceDirectory(comp, workspaceName, workspacePath);

			if (!source) {
				return null;
			}

			const workspaceBindingAlias = {
				name: workspaceName,
				source: source,
			};

			const workspaceBinding = {
				alias: workspaceBindingAlias,
			};

			return {
				config,
				workspaceBinding,
				source,
				root: workspacePath,
				configFile: viteConfigPath,
			};
		}),
	);

	return workspaces.filter((w) => w !== null) as Workspace[];
}
