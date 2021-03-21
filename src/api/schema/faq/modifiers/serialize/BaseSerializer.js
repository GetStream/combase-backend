/**
 * @name pineapple.sh/serialize/BaseSerializer
 * @desc Base set of shared methods for all formats.
 */

export class BaseSerializer {
	/**
	 * @name Serialize
	 * @param {Array<Node>} data
	 * @desc takes the value of the pineapple editor and begins traversing the tree.
	 */
	serialize(data, join = '\n') {
		if (!data) {
			throw new Error('Missing data, nothing to serialize.');
		}

		if (typeof this.serializeBlock !== 'function') {
			throw new TypeError('Serializer does not implement a valid serializeBlock() method');
		}

		if (typeof this.serializeLeaf !== 'function') {
			throw new TypeError('Serializer does not implement a valid serializeLeaf() method');
		}

		return data
			.flatMap(rootNode => this.serializeBlock(rootNode, null))
			.filter(b => Boolean(b))
			.join(join);
	}

	serializeBlock = (node, parent) => {
		if (node.type) {
			const serializer = this.rules[node.type];

			if (!serializer) throw new Error(`No serializer for node type: ${node.type}`);

			return serializer(node, parent);
		}

		if (node.children) {
			return node.children.map(child => this.serializeBlock(child, node));
		}
	};

	serializeLeaf = leaf => {
		const { text, type, ...rest } = leaf;

		if (type) {
			// Inline Block Node
			return this.serializeBlock(leaf);
		}

		let value = text;

		const marks = Object.entries(rest)
			.filter(([_, enabled]) => enabled) // eslint-disable-line no-unused-vars
			.map(([markType]) => markType);

		marks.forEach(mark => {
			value = this.markRules[mark](value);
		});

		return value;
	};
}
