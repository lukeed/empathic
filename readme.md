# empathic [![CI](https://github.com/lukeed/empathic/workflows/CI/badge.svg)](https://github.com/lukeed/empathic/actions?query=workflow%3ACI) [![licenses](https://licenses.dev/b/npm/empathic)](https://licenses.dev/npm/empathic)

> A set of small and [fast](/benchmarks.md) Node.js utilities to understand your pathing needs.

Multiple submodules (eg, `empathic/find`) are offered, _each of which_ are:

* **fast** — 8x to 40x faster than popular alternatives
* **modern** — make use of newer `node:*` native APIs
* **small** — ranging from 200b to 500b in size
* **safe** — zero-dependency & easy to read

## Install

```sh
$ npm install empathic
```

## Usage

```ts
import { resolve } from 'node:path';
import * as find from 'empathic/find';
import * as pkg from 'empathic/package';

let root = resolve('path/to/app');

// Find closest "foobar.config.js" file
let file = find.up('foobar.config.js', { cwd: root });
//=> eg "/.../path/foobar.config.js"

// Find closest "package.json" file
let pkgfile = pkg.up({ cwd: root });
//=> eg "/.../path/package.json"

// Construct (optionally create) "foobar" cache dir
let cache = pkg.cache('foobar', {
	cwd: root,
	create: true,
});
//=> eg "/.../path/node_modules/.cache/foobar"
```

## API

### `empathic/access`

> [Source](/main/src/access.ts) · **Size:** `259b`

Check for file access/permissions. Named [`fs.accessSync`](https://nodejs.org/docs/latest/api/fs.html#fsaccesssyncpath-mode) shortcuts.

### `empathic/find`

> [Source](/main/src/find.ts) · [Benchmark](/benchmarks#find) · **Size:** `321b`

Find files and/or directories by walking up parent directories.

### `empathic/package`

> [Source](/main/src/package.ts) · [Benchmark](/benchmarks.md#package) · **Size:** `505b`

Convenience helpers for dealing with `package.json` files and/or `node_modules` packages.

### `empathic/resolve`

> [Source](/main/src/resolve.ts) · [Benchmark](/benchmarks#resolve) · **Size:** `419b`


### `empathic/walk`

> [Source](/main/src/walk.ts) · [Benchmark](/benchmarks#walk) · **Size:** `208b`

Collect all the parent directories of a target. Offers `cwd` and `limit` options.


## License

MIT © [Luke Edwards](https://lukeed.com)
