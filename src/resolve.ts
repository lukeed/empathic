import { createRequire } from 'node:module';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolve an abolsute path from {@link root}, but only
 * if {@link input} isn't already absolute.
 *
 * @param input The path to resolve.
 * @param root The base path; default = process.cwd()
 * @returns The resolved absolute path.
 */
export function absolute(input: string, root?: string): string {
	return isAbsolute(input) ? input : resolve(root || '.', input);
}

/**
 * Resolve a module path from a given root directory.
 *
 * Emulates [`require.resolve`](https://nodejs.org/docs/latest/api/modules.html#requireresolverequest-options), so module identifiers are allowed.
 *
 * @see resolve-from
 */
export function from(root: URL | string, ident: string, silent: true): string | undefined;
export function from(root: URL | string, ident: string, silent?: false): string;
export function from(root: URL | string, ident: string, silent?: boolean): string | undefined;
export function from(root: URL | string, ident: string, silent?: boolean) {
	try {
		// NOTE: dirs need a trailing "/" OR filename. With "/" route,
		// Node adds "noop.js" as main file, so just do "noop.js" anyway.
		let r = (root instanceof URL || root.startsWith('file://'))
			? join(fileURLToPath(root), 'noop.js')
			: join(absolute(root), 'noop.js');

		return createRequire(r).resolve(ident);
	} catch (err) {
		if (!silent) throw err;
	}
}

/**
 * Resolve a module path from the current working directory.
 *
 * Alias for {@link from} using the CWD as its root.
 *
 * @see resolve-cwd
 */
export function cwd(ident: string, silent: true): string | undefined;
export function cwd(ident: string, silent?: false): string;
export function cwd(ident: string, silent?: boolean): string | undefined;
export function cwd(ident: string, silent?: boolean) {
	return from(resolve(), ident, silent);
}
