import * as walk from './walk.ts';

let start = '.';
let exclude = [/\.tsx$/];

Deno.bench({
	group: 'raw',
	name: 'escalade',
	async fn() {
		let total = 0;
		await walk.escalade(start, (_, items) => {
			total += items.length;
		});
	},
});

Deno.bench({
	group: 'raw',
	name: 'walk.up',
	async fn() {
		let total = 0;
		for await (let tree of walk.up(start)) {
			total += tree.items.length;
		}
	},
});

Deno.bench({
	group: 'filter',
	name: 'escalade',
	async fn() {
		let total = 0;
		await walk.escalade(start, (_, items) => {
			total += items.length;
		}, exclude);
	},
});

Deno.bench({
	group: 'filter',
	name: 'walk.up',
	async fn() {
		let total = 0;
		for await (let tree of walk.up(start, { exclude })) {
			total += tree.items.length;
		}
	},
});
