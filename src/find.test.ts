import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { assertEquals } from 'jsr:@std/assert@1.0';
import { join, resolve } from 'node:path';
import * as find from './find.ts';

describe('find.up', () => {
	const fixtures = resolve('fixtures');

	it('is a function', () => {
		assertEquals(typeof find.up, 'function');
	});

	it('should default looking in current (cwd) directory', async () => {
		let output = await find.up('deno.json');
		assertEquals(output, resolve('deno.json'));
	});

	it('should use `options.cwd` directory', async () => {
		let output = await find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});

		assertEquals(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should stop at `options.limit` directory', async () => {
		let output = await find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			limit: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assertEquals(output, undefined);
	});

	it('should NOT process `options.limit` directory', async () => {
		let output = await find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			limit: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assertEquals(output, undefined);
	});
});
