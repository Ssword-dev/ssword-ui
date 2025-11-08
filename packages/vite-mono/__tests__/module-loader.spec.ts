import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { loadModule } from '../src/loader/loadModule';

function makeTempDir(prefix = 'vm-cl-') {
	return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('module-loader', () => {
	it('loads a JSON module file when present', async () => {
		const tmp = makeTempDir();
		try {
			const file = path.join(tmp, 'test.config.json');
			fs.writeFileSync(file, JSON.stringify({ hello: 'world' }));

			const result = await loadModule<{ hello: string }>(tmp, 'test.config.json');
			expect(result).not.toBeNull();
			expect((result as { hello?: string })?.hello).toBe('world');
		} finally {
			try {
				fs.rmSync(tmp, { recursive: true, force: true });
			} catch {}
		}
	});

	it('returns null when no matching module file exists', async () => {
		const tmp = makeTempDir();
		try {
			const result = await loadModule(tmp, 'no-such-file.json');
			expect(result).toBeNull();
		} finally {
			try {
				fs.rmSync(tmp, { recursive: true, force: true });
			} catch {}
		}
	});
});
