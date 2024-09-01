import { assertEquals } from 'jsr:@std/assert@1.0';
import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { dirname, join, resolve } from 'node:path';
import { env } from 'node:process';

import * as pkg from './package.ts';

const fixtures = resolve('fixtures');

// see scripts/fixtures.ts
const pkgfile = join(fixtures, 'a/b/package.json');
const start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

describe('package.up', () => {
	it('should be a function', () => {
		assertEquals(typeof pkg.up, 'function');
	});

	it('should find the nearest "package.json" file', () => {
		let output = pkg.up();
		assertEquals(output, resolve('package.json')); // root
	});

	it('should use `options.cwd` to resolve nearest "package.json" file', () => {
		let output = pkg.up({ cwd: start });

		// see scripts/fixture.ts
		assertEquals(output, pkgfile);
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

describe('package.cache', () => {
	it('should be a function', () => {
		assertEquals(typeof pkg.cache, 'function');
	});

	it('should construct path from nearest "package.json" file', () => {
		let output = pkg.cache('foobar');
		assertEquals(output, resolve('node_modules/.cache/foobar')); // root
	});

	it('should use `options.cwd` for resolution', () => {
		let output = pkg.cache('foobar', { cwd: start });
		let expect = resolve(pkgfile, '../node_modules/.cache/foobar');

		assertEquals(output, expect);
	});

	it('should NOT look at/beyond `options.limit` directory', () => {
		let output = pkg.cache('foobar', {
			cwd: start,
			limit: dirname(pkgfile),
		});

		assertEquals(output, undefined);
	});

	it('should ignore invalid `env.CACHE_DIR` values', () => {
		env.CACHE_DIR = 'true';

		let output = pkg.cache('foobar');
		let expect = resolve('node_modules/.cache/foobar'); // root
		delete env.CACHE_DIR;

		assertEquals(output, expect);
	});

	it('should use env.CACHE_DIR for base', () => {
		env.CACHE_DIR = fixtures;

		let output = pkg.cache('foobar');
		let expect = resolve(fixtures, 'foobar');
		delete env.CACHE_DIR;

		assertEquals(output, expect);
	});
});
