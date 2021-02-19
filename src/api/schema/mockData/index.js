import faker from 'faker';
import { createOrgChatCustomizations, syncOrganizationProfile } from 'utils/resolverMiddlewares/streamChat';

import schemaComposer from '../composer';

import { OrganizationTC } from '../organization/model';
import { AgentTC } from '../agent/model';

const Query = {};

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const processNames = (firstName, lastName) => [
	`${firstName} ${lastName}`,
	`${firstName} ${lastName.charAt(0)}.`,
	`${firstName}.${lastName.charAt(0)}`.toLowerCase(),
];

const createMockAgentData = (args = {}) => {
	const firstName = args?.name?.firstName || faker.name.firstName();
	const lastName = args?.name?.lastName || faker.name.lastName();

	const [full, display, slug] = processNames(firstName, lastName);

	return {
		name: {
			full,
			display,
		},
		role: 'Customer Support',
		avatar: '',
		organization: args.organization,
		email: `${slug}@${args.domain}`,
		password: 'password1',
		timezone: args.timezone,
		schedule: args.schedule,
	};
};

const Mutation = {
	generateMockData: schemaComposer.createResolver({
		kind: 'mutation',
		name: 'generateMockData',
		type: 'JSON',
		args: {
			agentCount: 'Int',
			organizationName: 'String',
			color: 'String',
			domain: 'String',
			stream: 'OrganizationStreamInput!',
			you: schemaComposer
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

				const you = createMockAgentData({
					domain,
					schedule,
					timezone: rp.args.you.timezone || 'Europe/Amsterdam',
					name: rp.args.you,
				});

				const agents = [you];

				const orgDoc = await OrganizationTC.mongooseResolvers
					.createOne()
					.withMiddlewares([syncOrganizationProfile, createOrgChatCustomizations])
					.resolve({
						...rp,
						args: {
							record: {
								name: organizationName,
								contact: {
									email: you.email,
								},
								stream: rp.args.stream,
							},
						},
					});

				console.log(orgDoc);
				agents[0].organization = orgDoc.record._id;

				for (let i = 0; i < agentCount; i++) {
					agents.push(
						createMockAgentData({
							domain,
							schedule,
							organization: orgDoc.record._id,
							timezone: i % 2 ? 'Europe/Amsterdam' : 'America/Denver',
						})
					);
				}

				await AgentTC.mongooseResolvers.createMany().resolve({
					...rp,
					args: { records: agents },
				});

				return agents;
			} catch (error) {
				console.error(error);
			}
		},
	}),
};

export default {
	Query,
	Mutation,
};
