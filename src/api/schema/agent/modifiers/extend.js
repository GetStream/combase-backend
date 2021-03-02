import 'dotenv/config';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
	});

	tc.addFields({
		token: 'String',
		available: 'Boolean',
	});

	tc.addRelation('organization', {
		prepareArgs: {
			_id: ({ organization }) => organization,
		},
		projection: { organization: true },
		resolver: () => tc.schemaComposer.getOTC('Organization').getResolver('get'),
	});

	tc.addRelation('tickets', {
		prepareArgs: {
			filter: ({ _id, organization }) => ({
				organization: organization.toString(),
				_operators: {
					agents: { in: [_id] },
				},
			}),
		},
		projection: {
			_id: true,
			organization: true,
		},
		resolver: () =>
			tc.schemaComposer
				.getOTC('Ticket')
				.mongooseResolvers.connection({
					findManyOpts: {
						filter: {
							operators: {
								agents: ['in'],
							},
						},
					},
				})
				.clone({ name: 'AgentTickets' }),
	});
};
