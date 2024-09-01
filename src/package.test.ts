import { assertEquals } from 'jsr:@std/assert@1.0';
import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { resolve } from 'node:path';

import * as pkg from './package.ts';

describe('package.up', () => {
	it('should be a function', () => {
		assertEquals(typeof pkg.up, 'function');
	});

	it('should find the nearest "package.json" file', () => {
		let output = pkg.up();
		assertEquals(output, resolve('package.json')); // root
	});

	it('should use `options.cwd` to resolve nearest "package.json" file', () => {
		let output = pkg.up({
			cwd: resolve('fixtures/a/b/c/d/e/f/g/h/i/j'),
		});

		// see scripts/fixture.ts
		assertEquals(output, resolve('fixtures/a/b/package.json'));
	});

	it('should stop resolving at `options.limit` directory', () => {
		let output = pkg.up({
			cwd: resolve('fixtures/a/b/c/d/e/f/g/h/i/j'),
			limit: resolve('fixtures/a/b/c/d/e/f'),
		});

		// see scripts/fixture.ts
		assertEquals(output, undefined);
	});
});
