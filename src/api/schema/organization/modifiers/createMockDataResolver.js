import faker from 'faker';
import { deepmerge } from 'graphql-compose';
import { streamCtx } from 'utils/streamCtx';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const processNames = (firstName, lastName) => [
	`${firstName} ${lastName}`,
	`${firstName} ${lastName.charAt(0)}.`,
	`${firstName}.${lastName.charAt(0)}`.toLowerCase(),
];

const CACHE = {
	agents: [],
};
const cacheExists = (key, value) => CACHE[key].includes(value);
const cachePut = (key, value) => CACHE[key].push(value);

const createMockAgentData = (args = {}) => {
	const firstName = args?.name?.firstName || faker.name.firstName();
	const lastName = args?.name?.lastName || faker.name.lastName();

	const [full, display, slug] = processNames(firstName, lastName);
	let email = `${firstName}@${args.domain}`;

	if (cacheExists('agents', email)) {
		email = `${slug}@${args.domain}`;
	}

	cachePut('agents', email);

	return {
		name: {
			full,
			display,
		},
		role: 'Customer Support',
		avatar: '',
		organization: args.organization,
		email,
		password: 'password1',
		timezone: args.timezone,
		schedule: args.schedule,
	};
};

export const createMockDataResolver = tc =>
	tc.schemaComposer.createResolver({
		kind: 'mutation',
		name: 'generateMockData',
		type: 'JSON',
		args: {
			agentCount: 'Int',
			organizationName: 'String',
			color: 'String',
			domain: 'String',
			stream: 'OrganizationStreamInput!',
			you: tc.schemaComposer
				.createInputTC({
					name: 'MockAgentInput',
					fields: {
						firstName: 'String!',
						lastName: 'String!',
						timezone: 'String',
					},
				})
				.getTypeNonNull(),
		},
		resolve: async rp => {
			try {
				const { agentCount = 0, organizationName = 'Test', domain = 'testing.io' } = rp.args;

				const schedule = {};

				// eslint-disable-next-line no-unused-vars
				for (const dayName of daysOfWeek) {
					schedule[dayName] = {
						enabled: !dayName.startsWith('s'),
						start: {
							hour: 9,
							minute: 0,
						},
						end: {
							hour: 17,
							minute: 0,
						},
					};
				}

				// Create 'You' Agent
				const you = createMockAgentData({
					domain,
					schedule,
					timezone: rp.args.you.timezone || 'Europe/Amsterdam',
					name: rp.args.you,
				});

				/** Create organization with 'You' as the contact email */
				const orgDoc = await tc.mongooseResolvers.createOne().resolve(
					deepmerge(rp, {
						args: {
							record: {
								name: organizationName,
								contact: {
									email: you.email,
								},
								stream: rp.args.stream,
							},
						},
					})
				);

				/** update you with the org id */
				you.organization = orgDoc.record._id;

				/** concat any additionally requested fake agents */
				const agents = [you];

				if (agentCount > 0) {
					for (let i = 0; i < agentCount; i++) {
						agents.push(
							createMockAgentData({
								domain,
								schedule,
								organization: orgDoc.record._id,
								timezone: Math.random() < 0.5 ? 'Europe/Amsterdam' : 'America/Denver',
							})
						);
					}
				}

				/** Create a mock authenticated context object that includes the stream clients and org id, to ensure agentCreate goes off without a hitch */
				const mockContext = {
					...rp.context,
					organization: orgDoc.record._id,
					stream: streamCtx(rp.args.stream.key, rp.args.stream.secret, rp.args.stream.appId),
				};

				/** Get unresolved promises for all agents */
				/**
				 * it's no doubt a little slower this way, but allows us to call the same agentCreate as when using the UI.
				 * This takes care of creating the agent, and also synching data with Stream Chat/Feeds and creating follow relationships
				 */
				const agentPromises = agents.map(agent =>
					tc.schemaComposer
						.getOTC('Agent')
						.mongooseResolvers.createOne()
						.resolve(
							deepmerge(rp, {
								args: {
									record: agent,
								},
							})
						)
				);

				await Promise.all(agentPromises);

				return {
					organization: orgDoc.record._id,
				};
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		},
	});
