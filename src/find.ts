import { join } from 'node:path';
import { existsSync, statSync } from 'node:fs';

import * as walk from 'empathic/walk';
import type { Options } from 'empathic/walk';

export type { Options };

/**
 * Find an item by name, walking parent directories until found.
 *
 * @param name The item name to find.
 * @returns The absolute path to the item, if found.
 */
export function up(name: string, options?: Options): string | undefined {
	let dir: string, tmp: string;
	let start = options && options.cwd || '';
	for (dir of walk.up(start, options)) {
		tmp = join(dir, name);
		if (existsSync(tmp)) return tmp;
	}
}

/**
 * Get the first path that matches any of the names provided.
 *
 * > [NOTE]
 * > The order of {@link names} is respected.
 *
 * @param names The item names to find.
 * @returns The absolute path of the first item found, if any.
 */
export function any(names: string[], options?: Options): string | undefined {
	let dir: string, start = options && options.cwd || '';
	let j = 0, len = names.length, tmp: string;
	for (dir of walk.up(start, options)) {
		for (j = 0; j < len; j++) {
			tmp = join(dir, names[j]);
			if (existsSync(tmp)) return tmp;
		}
	}
}

/**
 * Find a file by name, walking parent directories until found.
 *
 * > [NOTE]
 * > This function only returns a value for file matches.
 * > A directory match with the same name will be ignored.
 *
 * @param name The file name to find.
 * @returns The absolute path to the file, if found.
 */
export function file(name: string, options?: Options): string | undefined {
	let dir: string, tmp: string;
	let start = options && options.cwd || '';
	for (dir of walk.up(start, options)) {
		try {
			tmp = join(dir, name);
			if (statSync(tmp).isFile()) return tmp;
		} catch {
			// ignore
		}
	}
}

/**
 * Find a directory by name, walking parent directories until found.
 *
 * > [NOTE]
 * > This function only returns a value for directory matches.
 * > A file match with the same name will be ignored.
 *
 * @param name The directory name to find.
 * @returns The absolute path to the file, if found.
 */
export function dir(name: string, options?: Options): string | undefined {
	let dir: string, tmp: string;
	let start = options && options.cwd || '';
	for (dir of walk.up(start, options)) {
		try {
			tmp = join(dir, name);
			if (statSync(tmp).isDirectory()) return tmp;
		} catch {
			// ignore
		}
	}
}
