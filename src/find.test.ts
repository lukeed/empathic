import * as assert from 'uvu/assert';
import { suite, type Test } from 'uvu';
import { join, resolve } from 'node:path';
import * as find from 'empathic/find';

type Builder = (it: Test) => unknown;
function describe(name: string, builder: Builder) {
	let it = suite(name);
	builder(it);
	it.run();
}

const fixtures = resolve('fixtures');

describe('find.up', (it) => {
	it('should be a function', () => {
		assert.type(find.up, 'function');
	});

	it('should default looking in current (cwd) directory', () => {
		let output = find.up('license');
		assert.is(output, resolve('license'));
	});

	it('should use `options.cwd` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});

		assert.is(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should stop at `options.stop` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assert.is(output, undefined);
	});

	it('should NOT process `options.stop` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assert.is(output, undefined);
	});
});

describe('find.any', (it) => {
	it('should be a function', () => {
		assert.type(find.any, 'function');
	});

	it('should looking in current (cwd) directory', () => {
		let output = find.any(['license']);
		assert.is(output, resolve('license'));
	});

	it('should respect the input order', () => {
		// license comes first in file system, but not here
		let output = find.any(['readme.md', 'license', 'deno.json']);
		assert.is(output, resolve('readme.md'));
	});

	it('should resolve from `options.cwd` directory', () => {
		let input = ['start.txt', 'file.txt'];
		let start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

		let output = find.any(input, { cwd: start });
		assert.is(output, join(start, 'start.txt'));

		start = join(start, '..');
		output = find.any(input, { cwd: start });
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should NOT process `options.stop` directory', () => {
		let output = find.any(['file.txt'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			stop: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assert.is(output, undefined);
	});
});
