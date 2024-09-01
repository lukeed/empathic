import { access, constants } from 'node:fs/promises';
import type { PathLike } from 'node:fs';

export function ok(path: PathLike, mode?: number) {
	return access(path, mode).then(() => true).catch(() => false);
}

export function writable(path: PathLike) {
	return ok(path, constants.W_OK);
}

export function readable(path: PathLike) {
	return ok(path, constants.R_OK);
}

export function executable(path: PathLike) {
	return ok(path, constants.X_OK);
}
