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
	let target = join(fixtures, 'a/b/c/d/e/f/file.txt');

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

		assert.is(output, target);
	});

	it('should stop after `options.last` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assert.is(output, undefined);
	});

	it('should still search `options.last` directory', () => {
		let output = find.up('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assert.is(output, target);
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

	it('should still search `options.last` directory', () => {
		let output = find.any(['file.txt'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should stop after `options.last` directory', () => {
		let output = find.any(['file.txt'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assert.is(output, undefined);
	});

	it('should allow first match to be a directory', () => {
		let output = find.any(['g'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/g'));
	});

	it('should ignore directories when `options.type` is "file"', () => {
		// "g" is a directory inside "f", alongside "file.txt"
		let output = find.any(['g'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			type: 'file',
		});
		assert.is(output, undefined);
	});

	it('should ignore files when `options.type` is "dir"', () => {
		// "file.txt" is a file inside "f", alongside the "g" directory
		let output = find.any(['file.txt', 'g'], {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			type: 'dir',
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/g'));
	});

	it('should prefer the nearest directory over the input order with `options.type`', () => {
		// "file.txt" is listed first, but "start.txt" is nearer
		let start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');
		let output = find.any(['file.txt', 'start.txt'], { cwd: start, type: 'file' });
		assert.is(output, join(start, 'start.txt'));
	});
});

describe('find.file', (it) => {
	it('should be a function', () => {
		assert.type(find.file, 'function');
	});

	it('should looking in current (cwd) directory', () => {
		let output = find.file('license');
		assert.is(output, resolve('license'));
	});

	it('should use `options.cwd` directory', () => {
		let output = find.file('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should stop after `options.last` directory', () => {
		let output = find.file('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assert.is(output, undefined);
	});

	it('should still search `options.last` directory', () => {
		let output = find.file('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f'), // < file.txt is here
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/file.txt'));
	});

	it('should ignore directory with matching name', () => {
		let output = find.file('e', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});
		assert.is(output, undefined);
	});
});

describe('find.dir', (it) => {
	it('should be a function', () => {
		assert.type(find.dir, 'function');
	});

	it('should looking in current (cwd) directory', () => {
		let output = find.dir('fixtures');
		assert.is(output, resolve('fixtures'));
	});

	it('should use `options.cwd` directory', () => {
		let output = find.dir('f', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f'));
	});

	// there is NO "g" directory inside the "fixtures/.../g" dir
	it('should stop after `options.last` directory', () => {
		let output = find.dir('g', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f/g'),
		});
		assert.is(output, undefined);
	});

	// there IS a "g" directory inside the "fixtures/.../f" dir
	it('should still search `options.last` directory', () => {
		let output = find.dir('g', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
			last: join(fixtures, 'a/b/c/d/e/f'),
		});
		assert.is(output, join(fixtures, 'a/b/c/d/e/f/g'));
	});

	it('should ignore file with matching name', () => {
		let output = find.dir('file.txt', {
			cwd: join(fixtures, 'a/b/c/d/e/f/g/h/i/j'),
		});
		assert.is(output, undefined);
	});
});
