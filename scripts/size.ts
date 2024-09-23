async function HEAD(ident: Identifier) {
	let [name, version] = ident.split('@');

	let r = await fetch(`https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`, {
		method: 'POST',
	});

	return r.headers.get('content-length') || '???';
}

type Identifier = `${string}@${string}`;

type Package = {
	name: Identifier;
	needs?: Tree;
};

type Tree = Package[];

let tree: Tree = [{
	name: 'chalk@2.4.2',
	needs: [{
		name: 'ansi-styles@3.2.1',
		needs: [{
			name: 'color-convert@1.9.3',
			needs: [{
				name: 'color-name@1.1.3',
			}],
		}],
	}, {
		name: 'escape-string-regexp@1.0.5',
	}, {
		name: 'supports-color@5.5.0',
		needs: [{
			name: 'has-flag@3.0.0',
		}],
	}],
}];

async function walk(tree: Tree): Promise<void> {
	if (!tree.length) return; // Base case: if the tree is empty, do nothing

	await Promise.all(
		tree.map(async (pkg) => {
			let needs = pkg.needs ? walk(pkg.needs) : Promise.resolve();
			let [main, kids] = await Promise.all([HEAD(pkg.name), needs]);
			console.log({ main, kids });
		}),
	);
}

await walk(tree);
