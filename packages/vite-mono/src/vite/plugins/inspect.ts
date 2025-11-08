import { Plugin } from 'vite';
import Logger from '../../core/logger';

interface InspectPluginOptions {
	logger: Logger;
}

function inspectPlugin({ logger }: InspectPluginOptions): Plugin {
	return {
		name: 'inspect-plugin',
		enforce: 'pre',
		transform(code, id, _) {
			logger.log(`\t---\t${id}\t---\t\n${code}`);
			return {
				code,
			};
		},
	};
}

export default inspectPlugin;
