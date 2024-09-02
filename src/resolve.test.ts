import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { assert, assertEquals, assertInstanceOf, assertThrows } from 'jsr:@std/assert@1.0';
import { pathToFileURL } from 'node:url';
import * as path from 'node:path';

import * as resolve from './resolve.ts';

describe('resolve.absolute', () => {
	it('should be a function', () => {
		assertEquals(typeof resolve.absolute, 'function');
	});

	it('should respect absolute inputs', () => {
		let input = path.resolve('fixtures/a/b/c');
		let output = resolve.absolute(input);
		assertEquals(output, input);
	});

	it('should resolve non-absolute inputs', () => {
		let output = resolve.absolute('fixtures/a/b/c');
		assertEquals(output, path.resolve('fixtures/a/b/c'));
	});

	it.skip('should handle file:/// inputs', () => {
		let real = path.resolve('fixtures');
		let input = pathToFileURL(real).toString();
		let output = resolve.absolute(input);
		assertEquals(output, real);
	});
});

describe('resolve.from', () => {
	it('should be a function', () => {
		assertEquals(typeof resolve.from, 'function');
	});

	it('should throw MODULE_NOT_FOUND if identifer not found', () => {
		let err = assertThrows(() => resolve.from('fixtures', 'foobar'));

		// deno-lint-ignore no-explicit-any
		let { code, requireStack } = err as any;

		assertInstanceOf(err, Error);
		assertEquals(code, 'MODULE_NOT_FOUND');
		assert(err.message.includes("Cannot find module 'foobar'"));
		// NOTE: the "noop.js" is added internally (lol) because its a dir
		assertEquals(requireStack, [path.resolve('fixtures/noop.js')]);
	});

	it('should NOT throw if `silent` enabled', () => {
		let output = resolve.from('foo', 'bar', true);
		assertEquals(output, undefined);
	});

	it('should resolve relative paths', async () => {
		let target = path.resolve('fixtures/foo.js');

		try {
			(await Deno.create(target)).close();
			let output = resolve.from('fixtures', './foo');
			assertEquals(output, target);
		} finally {
			await Deno.remove(target);
		}
	});

	it('should resolve node_module identifiers', async () => {
		let moddir = path.resolve('fixtures/node_modules');

		let foobar = path.join(moddir, 'foobar');
		let pkgfile = path.join(foobar, 'package.json');
		let target = path.join(foobar, 'index.js');

		try {
			await Deno.mkdir(foobar, { recursive: true });

			(await Deno.create(pkgfile)).close();
			(await Deno.create(target)).close();

			let output = resolve.from('fixtures', 'foobar');
			assertEquals(output, target);
		} finally {
			await Deno.remove(moddir, { recursive: true });
		}
	});
});

describe('resolve.cwd', () => {
	it('should be a function', () => {
		assertEquals(typeof resolve.cwd, 'function');
	});

	it('should throw if identifier does not exist', () => {
		let err = assertThrows(() => resolve.cwd('foobar'));

		// deno-lint-ignore no-explicit-any
		let { code, requireStack } = err as any;

		assertInstanceOf(err, Error);
		assertEquals(code, 'MODULE_NOT_FOUND');
		assert(err.message.includes("Cannot find module 'foobar'"));
		// NOTE: the "noop.js" is added internally (lol) because its a dir
		assertEquals(requireStack, [path.resolve('noop.js')]);
	});

	it('should NOT throw if `silent` enabled', () => {
		let output = resolve.cwd('foobar', true);
		assertEquals(output, undefined);
	});

	it('should resolve relative paths', () => {
		let target = path.resolve('deno.json');
		let output = resolve.cwd('./deno.json');
		assertEquals(output, target);
	});

	it('should resolve node_module identifiers', async () => {
		let moddir = path.resolve('node_modules');

		let foobar = path.join(moddir, 'foobar');
		let pkgfile = path.join(foobar, 'package.json');
		let target = path.join(foobar, 'index.js');

		try {
			await Deno.mkdir(foobar, { recursive: true });

			(await Deno.create(pkgfile)).close();
			(await Deno.create(target)).close();

			let output = resolve.cwd('foobar');
			assertEquals(output, target);
		} finally {
			await Deno.remove(foobar, { recursive: true });
		}
	});
});
