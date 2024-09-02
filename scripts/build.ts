// Publish:
//   $ npm version <asd>
//   $ git push origin main --tags
//   #-> CI builds w/ publish

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import oxc from 'npm:oxc-transform@^0.25';
import { minify } from 'npm:terser@5.31';

const src = resolve('src');
const outdir = resolve('npm');

const Inputs = [
	'access.ts',
	'find.ts',
	'package.ts',
	'resolve.ts',
	'walk.ts',
];

function bail(label: string, errors: string[]): never {
	console.error('[%s] error(s)\n', label, errors.join(''));
	Deno.exit(1);
}

function copy(file: string) {
	if (existsSync(file)) {
		console.log('> writing "%s" file', file);
		return Deno.copyFile(file, join(outdir, file));
	}
}

async function transform(filename: string) {
	let entry = join(src, filename);
	let source = await Deno.readTextFile(entry);

	let xform = oxc.transform(entry, source, {
		typescript: {
			onlyRemoveTypeImports: true,
			declaration: true,
		},
	});

	if (xform.errors.length > 0) {
		bail('transform', xform.errors);
	}

	let rgx = /\.tsx?$/;
	let esm = filename.replace(rgx, '.mjs');
	let dts = filename.replace(rgx, '.d.mts');

	let outfile = join(outdir, dts);
	console.log('> writing "%s" file', dts);
	await Deno.writeTextFile(outfile, xform.declaration!);

	outfile = join(outdir, esm);
	console.log('> writing "%s" file', esm);
	await Deno.writeTextFile(outfile, xform.sourceText);

	try {
		let min = await minify(xform.sourceText, {
			ecma: 2020,
			mangle: true,
			compress: true,
			toplevel: true,
			module: true,
		});
		if (!min.code) throw 1;

		console.log('::notice::%s (%d b)', esm, min.code.length);
	} catch (err) {
		bail('terser', err);
	}
}

if (existsSync(outdir)) {
	console.log('! removing "npm" directory');
	await Deno.remove(outdir, { recursive: true });
}

await Deno.mkdir(outdir);

for (let name of Inputs) {
	await transform(name);
}

await copy('package.json');
await copy('readme.md');
await copy('license');
