import { join, resolve } from 'node:path';
import { readdir } from 'node:fs/promises';

import escalade from 'npm:escalade@3.2.0';
import * as simple from 'npm:find-up-simple@1.0.0';
import { findUp } from 'npm:find-up@7.0.0';

import * as find from './find.ts';
import * as walk from './walk.ts';

let fixtures = resolve('fixtures');
let start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

let level6 = 'file.txt';
let level10 = 'deno.json';
let other = Math.random().toString(16).slice(4);

// like find.up, but readdir->check
async function alt(name: string, options?: find.Options) {
	let dir: string, arr: string[];
	let start = options && options.cwd || '';
	for (dir of walk.up(start, options)) {
		arr = await readdir(dir);
		if (!!~arr.indexOf(name)) {
			return join(dir, name);
		}
	}
}

const Candidates = {
	'find-up'(target: string) {
		return findUp(target, { cwd: start });
	},
	'find-up-simple'(target: string) {
		return simple.findUp(target, { cwd: start });
	},
	'escalade'(target: string) {
		return escalade(start, (_, items) => {
			return items.includes(target) && target;
		});
	},
	'find.up'(target: string) {
		return find.up(target, { cwd: start });
	},
	'find.up (alt)'(target: string) {
		return alt(target, { cwd: start });
	},
};

const Benches = {
	'level-6': level6,
	'level-10': level10,
	'missing': other,
};

for (let name in Benches) {
	let input = Benches[name as keyof typeof Benches];

	Deno.bench({
		group: name,
		name: 'find-up',
		async fn() {
			let _ = await Candidates['find-up'](input);
		},
	});

	Deno.bench({
		group: name,
		name: 'find-up-simple',
		async fn() {
			let _ = await Candidates['find-up-simple'](input);
		},
	});

	Deno.bench({
		group: name,
		name: 'escalade',
		async fn() {
			let _ = await Candidates['escalade'](input);
		},
	});

	Deno.bench({
		group: name,
		name: 'find.up (alt)',
		async fn() {
			let _ = await Candidates['find.up (alt)'](input);
		},
	});

	Deno.bench({
		group: name,
		name: 'find.up (sync)',
		fn() {
			let _ = Candidates['find.up'](input);
		},
	});
}
