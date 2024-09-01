import { dirname } from 'node:path';
import { absolute } from './resolve.ts';

export function up(base: string) {
	let prev = absolute(base);
	let tmp = dirname(prev);
	let arr: string[] = [];

	while (true) {
		arr.push(tmp);
		tmp = dirname(prev = tmp);
		if (tmp === prev) return arr;
	}
}

export type Options = {
	cwd?: string;
	limit?: string;
};

export function options(base: string, options?: Options) {
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
