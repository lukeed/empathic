import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { assertEquals } from 'jsr:@std/assert@1.0';
import { join, resolve } from 'node:path';
import * as find from './find.ts';

const fixtures = resolve('fixtures');

describe('find.up', () => {
	it('should be a function', () => {
		assertEquals(typeof find.up, 'function');
	});

	it('should default looking in current (cwd) directory', () => {
		let output = find.up('deno.json');
		assertEquals(output, resolve('deno.json'));
	});

	it('should use `options.cwd` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});

		assertEquals(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should stop at `options.stop` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assertEquals(output, undefined);
	});

	it('should NOT process `options.stop` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assertEquals(output, undefined);
	});
});

describe('find.any', () => {
	it('should be a function', () => {
		assertEquals(typeof find.any, 'function');
	});

	it('should looking in current (cwd) directory', () => {
		let output = find.any(['deno.json']);
		assertEquals(output, resolve('deno.json'));
	});

	it('should respect the input order', () => {
		// deno.json comes first in file system, but not here
		let output = find.any(['license', 'deno.json']);
		assertEquals(output, resolve('license'));
	});

	it('should resolve from `options.cwd` directory', () => {
		let input = ['start.txt', 'file.txt'];
		let start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

		let output = find.any(input, { cwd: start });
		assertEquals(output, join(start, 'start.txt'));

		start = join(start, '..');
		output = find.any(input, { cwd: start });
		assertEquals(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should NOT process `options.stop` directory', () => {
		let output = find.any(['file.txt'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assertEquals(output, undefined);
	});
});
