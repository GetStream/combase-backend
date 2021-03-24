import { pluralize } from 'graphql-compose';
import mongoose from 'mongoose';

const defaultOpts = {
	findParentBy: {
		_id: 'MongoID!',
	},
};

export const createAddTagResolver = (tc, opts = defaultOpts) =>
	tc.schemaComposer.createResolver({
		name: 'addTag',
		kind: 'mutation',
		type: 'String!',
		args: {
			...opts.findParentBy,
			name: 'String!',
		},
		resolve: async rp => {
			const [findParentBy] = Object.keys(opts.findParentBy);

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

			await mongoose.model(tc.getTypeName()).findOneAndUpdate(
				{
					[findParentBy]: rp.args[findParentBy],
					organization,
				},
				{ $addToSet: { tags: [tag._id] } },
				{ new: true }
			);

			return name;
		},
	});

export const createRemoveTagResolver = (tc, opts = defaultOpts) =>
	tc.schemaComposer.createResolver({
		name: 'removeTag',
		kind: 'mutation',
		type: 'String!',
		args: {
			...opts.findParentBy,
			name: 'String!',
		},
		resolve: async rp => {
			const [findParentBy] = Object.keys(opts.findParentBy);
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

			await mongoose.model(tc.getTypeName()).findOneAndUpdate(
				{
					[findParentBy]: rp.args[findParentBy],
					organization,
				},
				{ $pull: { tags: tag._id } },
				{ new: true }
			);

			return name;
		},
	});

export const createChildTagRelationship = tc => {
	tc.addRelation('childTags', {
		prepareArgs: {
			filter: source => ({
				_operators: {
					_id: {
						in: source.tags,
					},
				},
			}),
		},
		projection: {
			tags: true,
		},
		resolver: () => tc.schemaComposer.getOTC('Tag').mongooseResolvers.connection({ name: `${tc.getTypeName()}Tags` }),
	});
};
