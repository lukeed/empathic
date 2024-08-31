import * as walk from './walk.ts';

let start = '.';

let totalA = 0;
let totalB = 0;

let exclude = [/\.tsx$/];

Deno.bench('callback', async (b) => {
	await walk.escalade(start, (d, arr) => {
		totalB += arr.length;
		// for (let x of arr) callback.add(x.name);
	}, exclude);
});

Deno.bench('async gen', async (b) => {
	for await (let tree of walk.up(start, { exclude })) {
		// totalA += tree.items.length; // items.length;
		totalA += 1;
	}
});
