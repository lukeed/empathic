import { join } from 'node:path';
import { existsSync } from 'node:fs';

import * as walk from './walk.ts';

import type { Options } from './walk.ts';

export type { Options };

export function up(name: string, options?: Options) {
	let dir: string, tmp: string;
	let start = options && options.cwd || '';
	for (dir of walk.up(start, options)) {
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
