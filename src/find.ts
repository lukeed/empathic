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

/**
 * Get the first path that matches any of the names provided.
 * @see locate-path
 */
export function any(names: string[], options?: Options) {
	let dir: string, start = options && options.cwd || '';
	let j = 0, len = names.length, tmp: string;
	for (dir of walk.up(start, options)) {
		for (j = 0; j < len; j++) {
			tmp = join(dir, names[j]);
			if (existsSync(tmp)) return tmp;
		}
	}
}
