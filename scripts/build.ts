// Publish:
//   $ npm version <asd>
//   $ git push origin main --tags
//   #-> CI builds w/ publish

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import oxc from 'npm:oxc-transform@0.67.0';
import { minify } from 'npm:oxc-minify@0.67.0';

const Quiet = Deno.args.includes('--quiet');

const src = resolve('src');
const outdir = resolve('npm');

const Inputs = [
	'access.ts',
	'find.ts',
	'package.ts',
	'resolve.ts',
	'walk.ts',
];

function log(...args: unknown[]) {
	Quiet || console.log(...args);
}

function bail(label: string, errors: string[]): never {
	console.error('[%s] error(s)\n', label, errors.join(''));
	Deno.exit(1);
}

function copy(file: string) {
	if (existsSync(file)) {
		log('> writing "%s" file', file);
		return Deno.copyFile(file, join(outdir, file));
	}
}

async function transform(filename: string) {
	let entry = join(src, filename);
	let source = await Deno.readTextFile(entry);

	let xform = oxc.transform(entry, source, {
		lang: 'ts',
		target: 'node16',
		sourceType: 'module',
		typescript: {
			onlyRemoveTypeImports: true,
			declaration: {
				stripInternal: true,
			},
		},
	});

	if (xform.errors.length > 0) {
		bail('transform', xform.errors.map((err) => err.message));
	}

	let rgx = /\.tsx?$/;
	let esm = filename.replace(rgx, '.mjs');
	let dts = filename.replace(rgx, '.d.ts');

	let outfile = join(outdir, dts);
	log('> writing "%s" file', dts);
	await Deno.writeTextFile(outfile, xform.declaration!);

	outfile = join(outdir, esm);
	log('> writing "%s" file', esm);
	await Deno.writeTextFile(outfile, xform.code);

	try {
		let min = minify(esm, xform.code, {
			mangle: { toplevel: true },
		});
		if (!min.code) throw new Error('minify failed');

		log('::notice::%s (%d b)', esm, min.code.length);
	} catch (err) {
		bail('minify', [(err as Error).message]);
	}
}

if (existsSync(outdir)) {
	log('! removing "npm" directory');
	await Deno.remove(outdir, { recursive: true });
}

await Deno.mkdir(outdir);

for (let name of Inputs) {
	await transform(name);
}

await copy('package.json');
await copy('readme.md');
await copy('license');
