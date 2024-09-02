import { env } from 'node:process';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

import { writable } from './access.ts';
import * as find from './find.ts';

/**
 * Find the closest package.json file
 * @see package-up|pkg-up|pkg-dir
 */
export const up = /*#__PURE__*/ find.up.bind(0, 'package.json');

export function cache(
	name: string,
	options?: find.Options & {
		create?: boolean;
	},
) {
	options ||= {};

	let dir = env.CACHE_DIR;

	if (!dir || /^(1|0|true|false)$/.test(dir)) {
		let pkg = up(options);

		if (dir = pkg && dirname(pkg)) {
			let mods = join(dir, 'node_modules');
			let exists = existsSync(mods);

			// exit cuz exists but not writable
			// or cuz missing but parent not writable
			if (!writable(exists ? mods : dir)) return;

			dir = join(mods, '.cache');
		}
	}

	if (dir) {
		dir = join(dir, name);
		if (options.create && !existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
		return dir;
	}
}
