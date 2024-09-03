import * as assert from 'uvu/assert';
import { suite, type Test } from 'uvu';

import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import * as resolve from 'empathic/resolve';

type Builder = (it: Test) => unknown;
function describe(name: string, builder: Builder) {
	let it = suite(name);
	builder(it);
	it.run();
}

describe('resolve.absolute', (it) => {
	it('should be a function', () => {
		assert.type(resolve.absolute, 'function');
	});

	it('should respect absolute inputs', () => {
		let input = path.resolve('fixtures/a/b/c');
		let output = resolve.absolute(input);
		assert.is(output, input);
	});

	it('should resolve non-absolute inputs', () => {
		let output = resolve.absolute('fixtures/a/b/c');
		assert.is(output, path.resolve('fixtures/a/b/c'));
	});

	it.skip('should handle file:/// inputs', () => {
		let real = path.resolve('fixtures');
		let input = pathToFileURL(real).toString();
		let output = resolve.absolute(input);
		assert.is(output, real);
	});
});

describe('resolve.from', (it) => {
	it('should be a function', () => {
		assert.is(typeof resolve.from, 'function');
	});

	it('should throw MODULE_NOT_FOUND if identifer not found', () => {
		try {
			let _ = resolve.from('fixtures', 'foobar');
			assert.unreachable('should have thrown');
		} catch (err) {
			assert.instance(err, Error);

			let { code, requireStack } = err;

			assert.is(code, 'MODULE_NOT_FOUND');
			assert.match(err.message, "Cannot find module 'foobar'");
			// NOTE: the "noop.js" is added internally (lol) because its a dir
			assert.equal(requireStack, [path.resolve('fixtures/noop.js')]);
		}
	});

	it('should NOT throw if `silent` enabled', () => {
		let output = resolve.from('foo', 'bar', true);
		assert.is(output, undefined);
	});

	it('should resolve relative paths', async () => {
		let target = path.resolve('fixtures/foo.js');

		try {
			await fs.writeFile(target, '');
			let output = resolve.from('fixtures', './foo');
			assert.is(output, target);
		} finally {
			await fs.unlink(target);
		}
	});

	it('should resolve node_module identifiers', async () => {
		let moddir = path.resolve('fixtures/node_modules');

		let foobar = path.join(moddir, 'foobar');
		let pkgfile = path.join(foobar, 'package.json');
		let target = path.join(foobar, 'index.js');

		try {
			await fs.mkdir(foobar, { recursive: true });

			await fs.writeFile(target, '');
			await fs.writeFile(pkgfile, '{}');

			let output = resolve.from('fixtures', 'foobar');
			assert.is(output, target);
		} finally {
			await fs.rm(moddir, { recursive: true });
		}
	});
});

describe('resolve.cwd', (it) => {
	it('should be a function', () => {
		assert.type(resolve.cwd, 'function');
	});

	it('should throw if identifier does not exist', () => {
		try {
			let _ = resolve.cwd('foobar');
			assert.unreachable('should have thrown');
		} catch (err) {
			let { code, requireStack } = err;

			assert.instance(err, Error);
			assert.is(code, 'MODULE_NOT_FOUND');
			assert.match(err.message, "Cannot find module 'foobar'");
			// NOTE: the "noop.js" is added internally (lol) because its a dir
			assert.equal(requireStack, [path.resolve('noop.js')]);
		}
	});

	it('should NOT throw if `silent` enabled', () => {
		let output = resolve.cwd('foobar', true);
		assert.is(output, undefined);
	});

	it('should resolve relative paths', () => {
		let target = path.resolve('license');
		let output = resolve.cwd('./license');
		assert.is(output, target);
	});

	it('should resolve node_module identifiers', async () => {
		let moddir = path.resolve('node_modules');

		let foobar = path.join(moddir, 'foobar');
		let pkgfile = path.join(foobar, 'package.json');
		let target = path.join(foobar, 'index.js');

		try {
			await fs.mkdir(foobar, { recursive: true });

			await fs.writeFile(target, '');
			await fs.writeFile(pkgfile, '{}');

			let output = resolve.cwd('foobar');
			assert.is(output, target);
		} finally {
			await fs.rm(foobar, { recursive: true });
		}
	});
});
