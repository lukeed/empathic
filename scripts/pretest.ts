import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { cp, readdir } from 'node:fs/promises';

import oxc from 'npm:oxc-transform@^0.25';

// Transform all the test files
// NOTE: must be w/ `build` for tests to work~!

const Quiet = Deno.args.includes('--quiet');

const src = resolve('src');
const outdir = resolve('npm');

if (!existsSync(outdir)) {
	await Deno.mkdir(outdir);
}

// tests assume "fixtures" in CWD
// -> there for bench & Deno runner
await cp('fixtures', outdir);

for (let item of await readdir(src)) {
	if (item.endsWith('.test.ts')) {
		await transform(item);
	}
}

async function transform(filename: string) {
	let entry = join(src, filename);
	let source = await Deno.readTextFile(entry);

	let esm = oxc.transform(entry, source);
	if (esm.errors.length > 0) {
		console.error('[oxc] error(s)\n', esm.errors.join(''));
		Deno.exit(1);
	}

	let target = filename.replace(/\.tsx?$/, '.mjs');
	let outfile = join(outdir, target);

	Quiet || console.log('> writing "%s" file', target);
	await Deno.writeTextFile(outfile, esm.sourceText);
}
