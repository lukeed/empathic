import { basename, dirname, resolve } from 'node:path';
import * as fs from 'node:fs/promises';

import type { Dirent } from 'node:fs';

type Tree = {
	name: string;
	parent: string;
	path: string;
	items: Dirent[];
};

type Options = {
	cwd?: string;
	limit?: string;
	exclude?: RegExp[];
	symlinks?: boolean;
};

export async function escalade(
	start: string,
	callback: (directory: string, items: Dirent[]) => string | void,
	exclude?: RegExp[],
) {
	let ignores = exclude || [];
	let filter = ignores.length > 0;
	let i = 0, len = 0, keep: Dirent[];

	let tmp, dir = resolve(start);
	let s = await fs.stat(dir);
	if (!s.isDirectory()) {
		dir = dirname(dir);
	}

	while (true) {
		let arr = await fs.readdir(dir, {
			withFileTypes: true,
		});

		if (filter) {
			keep = [];
			for (i = 0, len = arr.length; i < len; i++) {
				isMatch(ignores, arr[i].name) || keep.push(arr[i]);
			}
		} else {
			keep = arr;
		}

		tmp = await callback(dir, keep);
		if (tmp) return resolve(dir, tmp);

		dir = dirname(tmp = dir);
		if (tmp === dir) break;
	}
}

function isMatch(arr: RegExp[], name: string): boolean {
	for (let i = 0, len = arr.length; i < len; i++) {
		if (arr[i].test(name)) return true;
	}
	return false;
}

export async function* up(
	base: string,
	options?: Options,
): AsyncGenerator<Tree> {
	let { cwd, limit, exclude = [] } = options || {};

	cwd = resolve(cwd || '.');
	limit = resolve(cwd, limit || '/');

	let i = 0, len = 0, arr: Dirent[], tree: Tree;
	let filter = exclude.length > 0;
	let dir = resolve(cwd, base);

	let s = await fs.stat(dir);
	if (s.isFile()) dir = dirname(dir);

	while (true) {
		arr = await fs.readdir(dir, {
			withFileTypes: true, // v10.11
		});

		tree = {
			name: basename(dir), // todo
			parent: dirname(dir),
			path: dir,
			items: arr,
		};

		if (filter) {
			tree.items = [];
			for (i = 0, len = arr.length; i < len; i++) {
				isMatch(exclude, arr[i].name) || tree.items.push(arr[i]);
			}
			// outer: for (i = 0, len = arr.length; i < len; i++) {
			// 	name = arr[i].name;
			// 	for (j = 0; j < jlen; j++) {
			// 		if (exclude[j].test(name)) continue outer;
			// 	}
			// 	tree.items.push(arr[i]);
			// }
		}

		yield tree;

		// if this WAS the limit
		if (dir === limit) return;
		dir = tree.parent;
	}
}
