export const tags = {
	name: 'tags',
	type: '[Tag!]',
	kind: 'query',
	args: {},
	resolve: (_, __, { models: { Tag }, organization }) => {
		if (!organization) {
			throw new Error('Unauthorized');
		}

		return Tag.find({ organization });
	},
};
