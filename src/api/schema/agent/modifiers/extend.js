import 'dotenv/config';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
	});

	tc.addFields({
		token: 'String',
	});

	tc.addRelation('organization', {
		prepareArgs: {
			_id: ({ organization }) => organization,
		},
		projection: { organization: true },
		resolver: () => tc.schemaComposer.getOTC('Organization').getResolver('get'),
	});
};
