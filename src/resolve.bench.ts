import * as path from 'node:path';
import * as resolve from './resolve.ts';

import rFrom from 'npm:resolve-from@5.0';
import rCWD from 'npm:resolve-cwd@3.0';

let start = path.resolve('fixtures/a/b/c');

Deno.bench({
	group: 'resolve-from',
	name: 'resolve-from',
	fn() {
		let _ = rFrom(start, './resolved.js');
	},
});

Deno.bench({
	group: 'resolve-from',
	name: 'resolve.from',
	fn() {
		let _ = resolve.from(start, './resolved.js');
	},
});

Deno.bench({
	group: 'resolve-cwd',
	name: 'resolve-cwd',
	fn() {
		let _ = rCWD('./fixtures/a/b/c/resolved.js');
	},
});

Deno.bench({
	group: 'resolve-cwd',
	name: 'resolve.cwd',
	fn() {
		let _ = resolve.cwd('./fixtures/a/b/c/resolved.js');
	},
});
