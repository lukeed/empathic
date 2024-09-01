import { isAbsolute, resolve } from 'node:path';

export function absolute(input: string, root?: string) {
	return isAbsolute(input) ? input : resolve(root || '.', input);
}
