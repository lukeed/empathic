import { join, resolve } from 'node:path';

import escalade from 'npm:escalade@3.2.0';
import { locatePath } from 'npm:locate-path@7.2';
import { findUpMultiple, findUpMultipleSync } from 'npm:find-up@7.0.0';

import * as find from './find.ts';

let fixtures = resolve('fixtures');
let start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

let junk = ['a.js', 'a.mjs', 'a.cjs', 'a.ts', 'a.mts', 'a.cts'];
let level6 = [...junk, 'file.txt'];
let level10 = [...junk, 'deno.json'];
let other = [...junk, Math.random().toString(16).slice(4)];

const Candidates = {
	'locate-path'(target: string[]) {
		return locatePath([...target], {
			cwd: start,
			type: 'file',
			preserveOrder: false,
			allowSymlinks: false,
		});
	},

	'locate-path (order)'(target: string[]) {
		return locatePath([...target], {
			cwd: start,
			type: 'file',
			preserveOrder: true,
			allowSymlinks: false,
		});
	},

	'find-up'(target: string[]) {
		return findUpMultiple([...target], {
			cwd: start,
			type: 'file',
			allowSymlinks: false,
		});
	},

	'find-up (sync)'(target: string[]) {
		return findUpMultipleSync([...target], {
			cwd: start,
			type: 'file',
			allowSymlinks: false,
		});
	},

	'escalade'(target: string[]) {
		let set = new Set(target);
		return escalade(start, (_, items) => {
			for (let i = 0; i < items.length; i++) {
				if (set.has(items[i])) return items[i];
			}
		});
	},

	'find.any (sync)'(target: string[]) {
		return find.any([...target], {
			cwd: start,
		});
	},
};

let Benches = {
	'locate-6': level6,
	'locate-10': level10,
	'missing-15': other,
};

for (let k in Benches) {
	let input = Benches[k as keyof typeof Benches];

	Deno.bench({
		group: k,
		name: 'locate-path',
		async fn() {
			let _ = await Candidates['locate-path']([...input]);
		},
	});

	Deno.bench({
		group: k,
		name: 'locate-path (order)',
		async fn() {
			let _ = await Candidates['locate-path (order)']([...input]);
		},
	});

	Deno.bench({
		group: k,
		name: 'find-up',
		async fn() {
			let _ = await Candidates['find-up']([...input]);
		},
	});

	Deno.bench({
		group: k,
		name: 'find-up (sync)',
		fn() {
			let _ = Candidates['find-up (sync)']([...input]);
		},
	});

	Deno.bench({
		group: k,
		name: 'escalade',
		async fn() {
			let _ = await Candidates['escalade']([...input]);
		},
	});

	Deno.bench({
		group: k,
		name: 'find.any (sync)',
		fn() {
			let _ = Candidates['find.any (sync)']([...input]);
		},
	});
}
