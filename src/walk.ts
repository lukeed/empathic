import { dirname } from 'node:path';
import { absolute } from 'empathic/resolve';

export type Options = {
	cwd?: string;
	limit?: string;
};

export function up(base: string, options?: Options): string[] {
	let { limit, cwd } = options || {};

	let tmp = absolute(base, cwd);
	let prev: string, arr: string[] = [];

	if (limit) limit = absolute(limit, cwd);

	while (true) {
		arr.push(tmp);
		tmp = dirname(prev = tmp);
		if (tmp === (limit || prev)) return arr;
	}
}
