import MagicString from 'npm:magic-string@0.30.17';
import { type Function, parseSync } from 'npm:oxc-parser@0.73.2';
import { walk } from 'npm:astray@1.1.1';

type Location = {
	start: number;
	end: number;
};

export function transform(esm: string) {
	let s = new MagicString(esm);
	let ast = parseSync('file.js', esm).program;

	walk(ast.body, {
		ImportDeclaration(n) {
			let { start, end } = n as unknown as Location;
			let src = n.source as unknown as {
				type: 'StringLiteral';
				value: string;
				start: number;
				end: number;
			};

			let from = src.value;

			// NOTE: remove "node:" for Node < 14
			// https://nodejs.org/api/esm.html#node-imports
			// if (from.startsWith('node:')) {
			// 	from = from.substring(5);
			// }

			let $locals: string[] = [];
			let $default: string | undefined;

			let i = 0, arr = n.specifiers;
			let tmp: typeof arr[number];

			for (; i < arr.length; i++) {
				tmp = arr[i];

				switch (tmp.type) {
					case 'ImportDefaultSpecifier':
					case 'ImportNamespaceSpecifier': {
						if ($default) throw new Error('Double `default` exports!');
						$default = tmp.local.name;
						break;
					}

					case 'ImportSpecifier': {
						let { imported, local } = tmp;
						if (imported.name !== local.name) {
							$locals.push(`${imported.name}: ${local.name}`);
						} else {
							$locals.push(local.name);
						}
						break;
					}
				}
			}

			let stmt = 'const ';
			if ($default) {
				stmt += $default;
			}
			if ($locals.length > 0) {
				if ($default) stmt += ', ';
				stmt += '{ ' + $locals.join(', ') + ' }';
			}

			let qq = s.snip(src.start, src.start + 1);
			stmt += ` = require(${qq + from + qq});`;
			s.overwrite(start, end, stmt);
		},
		ExportDefaultDeclaration(n) {
			let start = (n as unknown as Location).start;
			s.overwrite(start, start + 'export default'.length, 'module.exports =');
		},
		ExportNamedDeclaration(n) {
			let start = (n as unknown as Location).start;
			let type = n.declaration?.type;
			let key: string | undefined;

			if (type === 'FunctionDeclaration') {
				key = (n.declaration as Function).id?.name;
			} else {
				console.log('EXPORT NAMED TYPE?', n.declaration);
			}

			if (key) {
				s.remove(start, start + 'export '.length);
				s.append(`\nexports.${key} = ${key};`);
			}
		},
	});

	return s.toString();
}
