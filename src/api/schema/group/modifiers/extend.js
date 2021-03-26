import { deepmerge } from 'graphql-compose';
import { createChildTagRelationship } from 'utils/createTaggableEntity';

export const extend = tc => {
	tc.addRelation('members', {
		prepareArgs: {
			filter: ({ _id }) => ({
				_operators: {
					groups: {
						in: [_id],
					},
				},
			}),
		},
		projection: { _id: true },
		resolver: tc.schemaComposer
			.getOTC('Agent')
			.mongooseResolvers.connection({
				name: 'GroupMember',
				findManyOpts: {
					filter: {
						operators: {
							groups: ['in'],
						},
					},
				},
			})
			.wrapResolve(next => rp => {
				return next(deepmerge(rp, { args: { organization: rp.context.organization } }));
			}),
	});
};

export const childTags = createChildTagRelationship;
