import mongoose from 'mongoose';

export const createAddToGroupResolver = tc =>
	tc.schemaComposer.createResolver({
		name: 'addToGroup',
		kind: 'mutation',
		type: tc,
		args: {
			_id: 'MongoID!',
			group: 'MongoID!',
		},
		resolve: async rp => {
			const { _id, group } = rp.args;
			const { organization } = rp.context;

			if (!organization) {
				throw new Error('Unauthorized.');
			}

			const groupDoc = await tc.schemaComposer
				.getOTC('Group')
				.getResolver('get')
				.resolve({
					...rp,
					args: {
						_id: group,
					},
				});

			return mongoose.model(tc.getTypeName()).findByIdAndUpdate(_id, { $addToSet: { groups: [groupDoc._id] } }, { new: true });
		},
	});

export const createRemoveFromGroupResolver = tc =>
	tc.schemaComposer.createResolver({
		name: 'removeFromGroup',
		kind: 'mutation',
		type: tc,
		args: {
			_id: 'MongoID!',
			group: 'MongoID!',
		},
		resolve: async rp => {
			const { _id, group } = rp.args;
			const { organization } = rp.context;

			if (!organization) {
				throw new Error('Unauthorized.');
			}

			const groupDoc = await tc.schemaComposer
				.getOTC('Group')
				.getResolver('get')
				.resolve({
					...rp,
					args: {
						_id: group,
					},
				});

			return mongoose.model(tc.getTypeName()).findByIdAndUpdate(
				_id,
				{
					$pull: { groups: { $in: [groupDoc._id] } },
				},
				{ new: true }
			);
		},
	});

export const createGroupsRelation = tc => {
	tc.addRelation('parentGroups', {
		prepareArgs: {
			filter: source => {
				return {
					_operators: {
						groups: {
							in: source?.groups,
						},
					},
				};
			},
		},
		projection: { groups: true },
		resolver: () =>
			tc.schemaComposer.getOTC('Group').mongooseResolvers.connection({
				name: 'AgentGroups',
				findManyOpts: {
					filter: {
						operators: {
							groups: ['in'],
						},
					},
				},
			}),
	});
};
