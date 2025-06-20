import { dirname } from 'node:path';
import { absolute } from 'empathic/resolve';

export type Options = {
	/**
	 * The CWD for the operation.
	 * @default "." (process.cwd)
	 */
	cwd?: string;
	/**
	 * The last directory to traverse.
	 *
	 * > [NOTE]
	 * > This directory is INCLUSIVE.
	 *
	 * @default "/"
	 */
	last?: string;
};

/**
 * Get all parent directories of {@link base}.
 * Stops after {@link Options['last']} is seen.
 *
 * @returns An array of absolute paths of all parent directories.
 */
export function up(base: string, options?: Options): string[] {
	let { last, cwd } = options || {};

	let tmp = absolute(base, cwd);
	let root = absolute(last || '/', cwd);
	let prev: string | undefined, arr: string[] = [];

	while (prev !== root) {
		arr.push(tmp);
		tmp = dirname(prev = tmp);
		if (tmp === prev) break;
	}

	return arr;
}
