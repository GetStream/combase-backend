import 'dotenv/config';
import zeroFill from 'zero-fill';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
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
					name: 'AgentTickets',
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

export const fields = tc => {
	tc.addFields({
		token: 'String',
		available: 'Boolean',
		streamToken: {
			name: 'streamToken',
			type: 'String',
			projection: {
				_id: true,
				organization: true,
			},
			resolve: (source, _, { agent, organization, stream }) => {
				if (!agent || agent !== source._id?.toString?.()) {
					throw new Error('Unauthorized');
				}

				if (!stream?.feeds || !organization || organization !== source.organization?.toString?.()) {
					throw new Error('Unauthorized');
				}

				return stream.feeds.createUserToken(source._id?.toString?.());
			},
		},
	});

	const createTimeStringField = field =>
		tc.schemaComposer.createResolver({
			name: 'convertTimeToStr',
			projection: { [field]: true },
			type: 'String!',
			kind: 'Mutation',
			description: `Creates a HTML compatible string from the '${field}' fields time parts.`,
			resolve: ({ source }) => `${zeroFill(2, source[field].hour)}:${zeroFill(2, source[field].minute)}`,
		});

	tc.schemaComposer.getOTC('AgentScheduleTime').addFields({
		startTime: createTimeStringField('start'),
		endTime: createTimeStringField('end'),
	});
};
