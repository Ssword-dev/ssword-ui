import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ViteMono from '../src/api';

function makeTempDir(prefix = 'vm-test-') {
	return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe('ViteMono workspace helpers', () => {
	let tmpRoot: string;
	beforeEach(() => {
		tmpRoot = makeTempDir();
	});

	afterEach(() => {
		// recursive remove
		try {
			fs.rmSync(tmpRoot, { recursive: true, force: true });
		} catch {}
	});

	it('discovers workspace entries from package.json workspaces', async () => {
		// root package.json
		const rootPkg = {
			workspaces: ['packages/*'],
		};
		fs.writeFileSync(path.join(tmpRoot, 'package.json'), JSON.stringify(rootPkg));

		// create two workspace packages
		const pkgDir = path.join(tmpRoot, 'packages');
		fs.mkdirSync(pkgDir);

		const a = path.join(pkgDir, 'pkg-a');
		const b = path.join(pkgDir, 'pkg-b');
		fs.mkdirSync(a, { recursive: true });
		fs.mkdirSync(b, { recursive: true });

		fs.writeFileSync(path.join(a, 'package.json'), JSON.stringify({ name: '@test/pkg-a' }));
		fs.writeFileSync(path.join(b, 'package.json'), JSON.stringify({ name: '@test/pkg-b' }));

		const comp = ViteMono.createCompilation({ root: tmpRoot });
		const entries = await ViteMono.getAllWorkspaceEntries(comp);
		expect(entries.length).toBe(2);
		const names = entries.map((e) => e[0]).sort();
		expect(names).toEqual(['@test/pkg-a', '@test/pkg-b']);
		const paths = entries.map((e) => path.resolve(e[1])).sort();
		expect(paths).toEqual([path.resolve(a), path.resolve(b)].sort());
	});

	it('detects source directory (prefers package.json "source" then common names)', async () => {
		const workspace = path.join(tmpRoot, 'workspace');
		fs.mkdirSync(workspace, { recursive: true });
		// package.json with explicit source

		fs.writeFileSync(
			path.join(workspace, 'package.json'),
			JSON.stringify({ name: 'ws', source: 'source-dir' }),
		);
		fs.mkdirSync(path.join(workspace, 'source-dir'));

		const comp = ViteMono.createCompilation({ root: tmpRoot });
		const source = await ViteMono.getSourceDirectory(comp, 'ws', workspace);
		expect(source).toBe('source-dir');

		// now remove package.json source and create only src
		fs.writeFileSync(path.join(workspace, 'package.json'), JSON.stringify({ name: 'ws' }));
		// create a default `src` folder so the resolver can detect it
		fs.mkdirSync(path.join(workspace, 'src'));
		expect(await ViteMono.getSourceDirectory(comp, 'ws', workspace)).toBe('src');
	});
});
