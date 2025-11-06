import { createCompilation } from './compilation';
import { getAllWorkspaceEntries } from './resolvers/discovery';
import { getBuildConfiguration } from './config-resolver';
import { getSourceDirectory } from './source-resolver';
import { getAllWorkspaces } from './resolvers/workspace-resolver';
import { getWorkspaceBindingAliasMap, finalAliasMapFor } from './alias';
import { buildWorkspaces } from './build';

const ViteMono = {
	createCompilation,
	getAllWorkspaceEntries,
	getBuildConfiguration,
	getSourceDirectory,
	getAllWorkspaces,
	getWorkspaceBindingAliasMap,
	finalAliasMapFor,
	build: buildWorkspaces,
};

export default ViteMono;
