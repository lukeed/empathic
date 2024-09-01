import * as walk from './walk.ts';
import { isAbsolute, resolve, sep } from 'node:path';

// let start = '.';
// let start = resolve('fixtures/a/b/c/d/e/f/g/h/i/j/start.txt');
let start = 'fixtures/a/b/c/d/e/f/g/h/i/j/start.txt';

Deno.bench('walk.up', () => {
	let total = 0;
	// let items = walk.up(start);
	// console.log('> items', items);
	for (let _ of walk.up(start)) {
		total += 1;
	}
});

Deno.bench('walk.options', () => {
	let total = 0;
	for (let _ of walk.options(start, { limit: '/' })) {
		total += 1;
	}
});

Deno.bench('split1', () => {
	let total = 0;
	for (let _ of split1(start)) {
		total += 1;
	}
});

Deno.bench('split2', () => {
	let total = 0;
	for (let _ of split2(start)) {
		total += 1;
	}
});

Deno.bench('split3', () => {
	let total = 0;
	for (let _ of split3(start)) {
		total += 1;
	}
});

Deno.bench('split4', () => {
	let total = 0;
	for (let _ of split4(start)) {
		total += 1;
	}
});

function split1(input: string) {
	let arr = (isAbsolute(input) ? input : resolve(input)).split(sep);
	let i = 0, len = arr.length, output = Array<string>(len);
	for (; i < len; i++) {
		output[i] = arr.slice(0, len - i).join(sep);
	}
	return output;
}

function split2(input: string) {
	let output: string[] = [];
	let base = isAbsolute(input) ? input : resolve(input);

	let match: RegExpExecArray | null;
	let rgx = new RegExp('[' + sep + ']+', 'g');

	while (match = rgx.exec(base)) {
		output.push(
			base.slice(0, match.index) || '/',
		);
	}

	return output.reverse();
}

function split3(input: string) {
	let base = isAbsolute(input) ? input : resolve(input);
	let len = base.length, output: string[] = [];

	while (len-- > 0) {
		if (base.charCodeAt(len) === 47) {
			output.push(
				base.slice(0, len) || '/',
			);
		}
	}

	return output;
}

function split4(input: string) {
	let base = isAbsolute(input) ? input : resolve(input);
	let len = base.length, output: string[] = [];

	while (len-- > 0) {
		if (base.charAt(len) === sep) {
			output.push(
				base.slice(0, len) || sep,
			);
		}
	}

	return output;
}
