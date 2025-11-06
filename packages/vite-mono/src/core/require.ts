import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(fileURLToPath(import.meta.url));

export default require;
