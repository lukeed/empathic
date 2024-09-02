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

//

Deno.bench({
	group: 'level-6',
	name: 'find-up',
	async fn() {
		let _ = await Candidates['find-up'](level6);
	},
});

Deno.bench({
	group: 'level-6',
	name: 'find-up-simple',
	async fn() {
		let _ = await Candidates['find-up-simple'](level6);
	},
});

Deno.bench({
	group: 'level-6',
	name: 'escalade',
	async fn() {
		let _ = await Candidates['escalade'](level6);
	},
});

Deno.bench({
	group: 'level-6',
	name: 'find.up (alt)',
	async fn() {
		let _ = await Candidates['find.up (alt)'](level6);
	},
});

Deno.bench({
	group: 'level-6',
	name: 'find.up (sync)',
	fn() {
		let _ = Candidates['find.up'](level6);
	},
});

// ---

Deno.bench({
	group: 'level-10',
	name: 'find-up',
	async fn() {
		let _ = await Candidates['find-up'](level10);
	},
});

Deno.bench({
	group: 'level-10',
	name: 'find-up-simple',
	async fn() {
		let _ = await Candidates['find-up-simple'](level10);
	},
});

Deno.bench({
	group: 'level-10',
	name: 'escalade',
	async fn() {
		let _ = await Candidates['escalade'](level10);
	},
});

Deno.bench({
	group: 'level-10',
	name: 'find.up (alt)',
	async fn() {
		let _ = await Candidates['find.up (alt)'](level10);
	},
});

Deno.bench({
	group: 'level-10',
	name: 'find.up (sync)',
	fn() {
		let _ = Candidates['find.up'](level10);
	},
});

// ---

Deno.bench({
	group: 'missing',
	name: 'find-up',
	async fn() {
		let _ = await Candidates['find-up'](other);
	},
});

Deno.bench({
	group: 'missing',
	name: 'find-up-simple',
	async fn() {
		let _ = await Candidates['find-up-simple'](other);
	},
});

Deno.bench({
	group: 'missing',
	name: 'escalade',
	async fn() {
		let _ = await Candidates['escalade'](other);
	},
});

Deno.bench({
	group: 'missing',
	name: 'find.up (alt)',
	async fn() {
		let _ = await Candidates['find.up (alt)'](other);
	},
});

Deno.bench({
	group: 'missing',
	name: 'find.up (sync)',
	fn() {
		let _ = Candidates['find.up'](other);
	},
});
