import { describe, expect, it, vi } from 'vitest';
import { isValidPackageJSON } from '../src/package';

describe('package', () => {
	describe('isValidPackageJSON', () => {
		it('should correctly detect malformed package.json objects', () => {
			const pkg = {
				name: '@foo/bar',
				version: 'invalid-version',
			};

			expect(isValidPackageJSON(pkg)).toBe(false);
		});
	});
});
