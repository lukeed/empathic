import { join } from 'node:path';
import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';

import { absolute } from './resolve.ts';
import * as walk from './walk.ts';
// import { ok } from './access.ts';

export type Options = {
	cwd?: string;
	limit?: string;
};

export async function up(name: string, options?: Options) {
	let { cwd, limit } = options || {};

	let start = absolute(name, cwd);
	if (limit) limit = absolute(limit, cwd);

	let dir: string, arr: string[];
	for (dir of walk.up(start)) {
		if (limit && dir === limit) return;

		arr = await fs.readdir(dir);
		if (!!~arr.indexOf(name)) {
			return join(dir, name);
		}
	}
}

export async function options(name: string, options?: Options) {
	options ||= {};
	let dir: string, arr: string[];
	for (dir of walk.options(options.cwd || '', options)) {
		arr = await fs.readdir(dir);
		if (!!~arr.indexOf(name)) {
			return join(dir, name);
		}
	}
}

// export function one(name: string, options?: Options) {
// 	let { cwd = '', limit } = options || {};
// 	if (limit) limit = absolute(limit, cwd);
// 	let dir: string, tmp: string;

// 	for (dir of walk.up(cwd)) {
// 		if (limit && dir === limit) return;

// 		tmp = join(dir, name);
// 		if (existsSync(tmp)) return tmp;
// 	}
// }

export function one(name: string, options?: Options) {
	let dir: string, tmp: string;
	let start = options && options.cwd || '';
	for (dir of walk.options(start, options)) {
		tmp = join(dir, name);
		if (existsSync(tmp)) return tmp;
	}
}

// function exists(path: string) {
// 	return ok(path).then((bool) => {
// 		return bool ? path : Promise.reject();
// 	});
// }

// export async function any(names: string[], options?: Options) {
// 	let root = options && options.cwd || '';
// 	let dir: string, arr: string[];
// 	for (dir of walk.up(root, options)) {
// 		arr = await fs.readdir(dir);
// 		await Promise.race(
// 			arr.map(exists),
// 		);
// 	}
// }
