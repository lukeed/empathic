import { describe, it } from 'jsr:@std/testing@1.0/bdd';
import { assertEquals } from 'jsr:@std/assert@1.0';
import { pathToFileURL } from 'node:url';
import * as native from 'node:path';

import * as resolve from './resolve.ts';

describe('resolve.absolute', () => {
	it('should be a function', () => {
		assertEquals(typeof resolve.absolute, 'function');
	});

	it('should respect absolute inputs', () => {
		let input = native.resolve('fixtures/a/b/c');
		let output = resolve.absolute(input);
		assertEquals(output, input);
	});

	it('should resolve non-absolute inputs', () => {
		let output = resolve.absolute('fixtures/a/b/c');
		assertEquals(output, native.resolve('fixtures/a/b/c'));
	});

	it.skip('should handle file:/// inputs', () => {
		let real = native.resolve('fixtures');
		let input = pathToFileURL(real).toString();
		let output = resolve.absolute(input);
		assertEquals(output, real);
	});
});
