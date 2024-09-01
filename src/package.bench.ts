import { dirname, resolve } from 'node:path';
import * as pkg from './package.ts';

import { pkgUp, pkgUpSync } from 'npm:pkg-up@5.0';
import { packageUp, packageUpSync } from 'npm:package-up@5.0';
import { packageDirectory, packageDirectorySync } from 'npm:pkg-dir@8.0';

let start = resolve('fixtures/a/b/c/d/e/f/g/h/i/j');

Deno.bench({
	group: 'pkg-up',
	name: 'package-up',
	async fn() {
		let _ = await packageUp({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-up',
	name: 'package-up (sync)',
	fn() {
		let _ = packageUpSync({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-up',
	name: 'pkg-up',
	async fn() {
		let _ = await pkgUp({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-up',
	name: 'pkg-up (sync)',
	fn() {
		let _ = pkgUpSync({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-up',
	name: 'package.up',
	fn() {
		let _ = pkg.up({
			cwd: start,
		});
	},
});

// ---

Deno.bench({
	group: 'pkg-dir',
	name: 'pkg-dir',
	async fn() {
		let _ = await packageDirectory({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-dir',
	name: 'pkg-dir (sync)',
	fn() {
		let _ = packageDirectorySync({
			cwd: start,
		});
	},
});

Deno.bench({
	group: 'pkg-dir',
	name: 'package.up w/ dirname()',
	fn() {
		let tmp = pkg.up({ cwd: start });
		if (tmp) tmp = dirname(tmp);
	},
});
