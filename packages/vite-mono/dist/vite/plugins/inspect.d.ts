import { Plugin } from 'vite';
import Logger from '../../core/logger';
interface InspectPluginOptions {
    logger: Logger;
}
declare function inspectPlugin({ logger }: InspectPluginOptions): Plugin;
export default inspectPlugin;
