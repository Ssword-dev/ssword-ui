import path from 'node:path';
import { fileURLToPath } from 'node:url';
export default {
	root: path.dirname(fileURLToPath(import.meta.url)),
};
