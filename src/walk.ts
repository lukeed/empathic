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
	stop?: string;
};

/**
 * Get all parent directories of {@link base}.
 * Stops at {@link Options['stop']} else system root ("/").
 *
 * @returns An array of absolute paths of all parent directories.
 */
export function up(base: string, options?: Options): string[] {
	let { stop, cwd } = options || {};

	let tmp = absolute(base, cwd), root = !stop;
	let prev: string, arr: string[] = [];

	if (stop) stop = absolute(stop, cwd);

	while (root || tmp !== stop) {
		arr.push(tmp);
		tmp = dirname(prev = tmp);
		if (tmp === prev) break;
	}

	return arr;
}
