import 'dotenv/config';
import { deepmerge } from 'graphql-compose';
import zeroFill from 'zero-fill';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
	});
};

export const fields = tc => {
	tc.addFields({
		token: 'String',
		available: 'Boolean',
		tickets: tc.schemaComposer
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
			.wrap(resolve => {
				// eslint-disable-next-line no-param-reassign
				resolve.projection = {
					_id: 1,
					organization: 1,
				};

				return resolve;
			})
			.wrapResolve(next => rp => {
				return next(
					deepmerge(rp, {
						args: {
							filter: {
								organization: rp.source.organization.toString(),
								_operators: {
									agents: { in: [rp.source._id] },
								},
							},
						},
					})
				);
			})
			.clone({ name: 'AgentTickets' }),
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
