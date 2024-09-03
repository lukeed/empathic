import * as assert from 'uvu/assert';
import { suite, type Test } from 'uvu';

import { env } from 'node:process';
import { dirname, join, resolve } from 'node:path';

import * as pkg from 'empathic/package';

type Builder = (it: Test) => unknown;
function describe(name: string, builder: Builder) {
	let it = suite(name);
	builder(it);
	it.run();
}

const fixtures = resolve('fixtures');

// see scripts/fixtures.ts
const pkgfile = join(fixtures, 'a/b/package.json');
const start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

describe('package.up', (it) => {
	it('should be a function', () => {
		assert.type(pkg.up, 'function');
	});

	it('should find the nearest "package.json" file', () => {
		let output = pkg.up();
		assert.is(output, resolve('package.json')); // root
	});

	it('should use `options.cwd` to resolve nearest "package.json" file', () => {
		let output = pkg.up({ cwd: start });

		// see scripts/fixture.ts
		assert.is(output, pkgfile);
	});

	it('should stop resolving at `options.stop` directory', () => {
		let output = pkg.up({
			cwd: resolve('fixtures/a/b/c/d/e/f/g/h/i/j'),
			stop: resolve('fixtures/a/b/c/d/e/f'),
		});

		// see scripts/fixture.ts
		assert.is(output, undefined);
	});
});

describe('package.cache', (it) => {
	it('should be a function', () => {
		assert.type(pkg.cache, 'function');
	});

	it('should construct path from nearest "package.json" file', () => {
		let output = pkg.cache('foobar');
		assert.is(output, resolve('node_modules/.cache/foobar')); // root
	});

	it('should use `options.cwd` for resolution', () => {
		let output = pkg.cache('foobar', { cwd: start });
		let expect = resolve(pkgfile, '../node_modules/.cache/foobar');

		assert.is(output, expect);
	});

	it('should NOT look at/beyond `options.stop` directory', () => {
		let output = pkg.cache('foobar', {
			cwd: start,
			stop: dirname(pkgfile),
		});

		assert.is(output, undefined);
	});

	it('should ignore invalid `env.CACHE_DIR` values', () => {
		env.CACHE_DIR = 'true';

		let output = pkg.cache('foobar');
		let expect = resolve('node_modules/.cache/foobar'); // root
		delete env.CACHE_DIR;

		assert.is(output, expect);
	});

	it('should use env.CACHE_DIR for base', () => {
		env.CACHE_DIR = fixtures;

		let output = pkg.cache('foobar');
		let expect = resolve(fixtures, 'foobar');
		delete env.CACHE_DIR;

		assert.is(output, expect);
	});
});
