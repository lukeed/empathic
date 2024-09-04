import { join } from 'node:path';
import { existsSync } from 'node:fs';

import { up as walkUp } from 'empathic/walk';
import type { Options } from 'empathic/walk';

export type { Options };

/**
 * Find an item by name, walking parent directories until found.
 *
 * @param name The item name to find.
 * @returns The absolute path to the item, if found.
 */
export function up(name: string, options?: Options): string | undefined {
	let dir: string;
	let start = options?.cwd ?? '';
	
	for (dir of walkUp(start, options)) {
		const tmp = join(dir, name);
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
	let dir: string;
	const start = options?.cwd ?? '';
	const len = names.length;
	
	for (dir of walkUp(start, options)) {
		for (let j = 0; j < len; j++) {
			const tmp = join(dir, names[j]);
			if (existsSync(tmp)) return tmp;
		}
	}
}
