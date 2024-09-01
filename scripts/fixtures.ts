import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

import * as walk from '../src/walk.ts';

const COUNT = +(Deno.args[0] ?? '6');

const fixtures = resolve('fixtures');
const start = join(fixtures, 'a/b/c/d/e/f/g/h/i/j');

if (!existsSync(start)) {
	await Deno.mkdir(start, {
		recursive: true,
	});

	await Deno.create(
		join(start, 'start.txt'),
	);

	await Deno.create(
		// target bench/tests target
		join(fixtures, 'a/b/c/d/e/f/file.txt'),
	);
}

for (let dir of walk.up(start)) {
	if (dir === fixtures) break;

	if (COUNT > 0) {
		let name = Math.random().toString(16).slice(4);

		await Promise.all(
			Array.from({ length: COUNT }, (_, idx) => {
				return Deno.create(
					join(dir, name + idx + '.txt'),
				);
			}),
		);
	}

	let arr = await fs.readdir(dir);
	console.log('> "%s" has %d file(s)', dir, arr.length);
}
