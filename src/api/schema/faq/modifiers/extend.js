import { FaqModel } from '../model';

export const addTagMutations = tc => {
	tc.addFields({
		addTag: tc.schemaComposer.createResolver({
			name: 'addTag',
			kind: 'mutation',
			type: 'String!',
			args: { name: 'String!' },
			projection: { _id: true },
			resolve: async rp => {
				const { _id } = rp.source;
				const { name } = rp.args;
				const { organization } = rp.context;

				if (!organization) {
					throw new Error('Unauthorized.');
				}

				const { record: tag } = await tc.schemaComposer
					.getOTC('Tag')
					.getResolver('create')
					.resolve({
						...rp,
						args: {
							name,
						},
					});

				await FaqModel.findByIdAndUpdate(_id, { $addToSet: { tags: [tag._id] } }, { new: true });

				return name;
			},
		}),
		removeTag: tc.schemaComposer.createResolver({
			name: 'removeTag',
			kind: 'mutation',
			type: 'String!',
			args: { name: 'String!' },
			projection: { _id: true },
			resolve: async rp => {
				const { _id } = rp.source;
				const { name } = rp.args;
				const { organization } = rp.context;

				if (!organization) {
					throw new Error('Unauthorized.');
				}

				const tag = await tc.schemaComposer
					.getOTC('Tag')
					.getResolver('get')
					.resolve({
						...rp,
						args: {
							name,
						},
					});

				await FaqModel.findByIdAndUpdate(_id, { $pull: { tags: tag._id } }, { new: true });

				return name;
			},
		}),
	});
};

export const fields = tc => {
	tc.addFields({
		title: {
			type: 'String',
			projection: {
				content: true,
			},
			resolve: ({ content }) => content?.[0]?.children?.[0]?.children?.[0]?.text,
		},
	});
};
