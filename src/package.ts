//
import * as find from './find.ts';

/**
 * Find the closest package.json file
 * @see package-up|pkg-up|pkg-dir
 */
export const up = /*#__PURE__*/ find.one.bind(0, 'package.json');
