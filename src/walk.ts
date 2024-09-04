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
	if (typeof options?.stop === 'undefined') {
		let tmp = absolute(base, options?.cwd);
		let prev: string;
		const arr: string[] = [];

		do {
			arr.push(tmp);
			prev = tmp;
			tmp = dirname(prev);
		} while (tmp !== prev);

		return arr;
	} else {
		const cwd = options?.cwd;

		const stop = absolute(options.stop, cwd);
		let tmp = absolute(base, cwd);
		if (tmp === stop) return [];

		let prev: string;
		const arr: string[] = [];

		do {
			arr.push(tmp);
			prev = tmp;
			tmp = dirname(prev);
		} while (tmp !== prev && tmp !== stop);

		return arr;
	}
}
