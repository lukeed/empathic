import { dirname } from 'node:path';
import { absolute } from 'empathic/resolve';

export type Options = {
	/**
	 * The CWD for the operation.
	 * @default "." (process.cwd)
	 */
	cwd?: string;
	/**
	 * The directory to stop at.
	 *
	 * > [NOTE]
	 * > This directory WILL NOT be included in the results.
	 *
	 * @default <none> (continue to system root)
	 */
	limit?: string;
};

/**
 * Get all parent directories of {@link base}.
 * Stops at {@link Options['limit']} else system root ("/").
 *
 * @returns An array of absolute paths of all parent directories.
 */
export function up(base: string, options?: Options): string[] {
	let { limit, cwd } = options || {};

	let tmp = absolute(base, cwd), root = !limit;
	let prev: string, arr: string[] = [];

	if (limit) limit = absolute(limit, cwd);

	while (root || tmp !== limit) {
		arr.push(tmp);
		tmp = dirname(prev = tmp);
		if (tmp === prev) break;
	}

	return arr;
}
