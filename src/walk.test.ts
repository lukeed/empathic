import * as assert from 'uvu/assert';
import { suite, type Test } from 'uvu';
import { join, resolve } from 'node:path';

import * as walk from 'empathic/walk';

type Builder = (it: Test) => unknown;
function describe(name: string, builder: Builder) {
	let it = suite(name);
	builder(it);
	it.run();
}

describe('walk.up', (it) => {
	const fixtures = resolve('fixtures');

	it('should be a function', () => {
		assert.type(walk.up, 'function');
	});

	let parents = walk.up(
		join(fixtures, 'a/b/c'),
	);

	it('should return an Array of parent directories', () => {
		assert.instance(parents, Array);
	});

	it('should resolve input from CWD if not absolute', () => {
		let output = walk.up('fixtures/a/b/c');
		assert.equal(output, parents);
	});

	it('should start with the initial directory', () => {
		assert.is(parents[0], resolve('fixtures/a/b/c'));
	});

	it('should return all parents until "/" root', () => {
		assert.is(parents[0], resolve('fixtures/a/b/c'));
		assert.is(parents[1], resolve('fixtures/a/b'));
		assert.is(parents[2], resolve('fixtures/a'));
		assert.is(parents[3], resolve('fixtures'));
		assert.is(parents[4], resolve('.'));
		// total chain length unknown
		assert.is(parents.at(-1), resolve('/'));
	});

	it('should resolve from `options.cwd` if input not absolute', () => {
		let output = walk.up('a/b/c', {
			cwd: fixtures,
		});

		assert.equal(output, parents);
	});

	it('should stop at `options.stop` directory', () => {
		let output = walk.up('fixtures/a/b/c', {
			stop: fixtures,
		});

		assert.ok(parents.length > output.length);
	});

	it('should NOT include `options.stop` directory', () => {
		let output = walk.up('fixtures/a/b/c', {
			stop: fixtures,
		});

		assert.is(output.at(-1), join(fixtures, 'a'));
	});

	it('should return nothing if stop === start', () => {
		let start = resolve('fixtures/a/b/c');
		let output = walk.up(start, { stop: start });
		assert.is(output.length, 0);
	});

	// find-up/locate-paths cycle in infinite loop
	it('should still exit at root if stop is child of start', () => {
		let start = resolve('fixtures/a/b/c');
		let stop = join(start, 'd/e/f');

		let output = walk.up(start, { stop });

		assert.is(output[0], resolve('fixtures/a/b/c'));
		assert.is(output[1], resolve('fixtures/a/b'));
		assert.is(output[2], resolve('fixtures/a'));
		assert.is(output.at(-1), resolve('/'));

		assert.equal(output, parents);
	});
});
