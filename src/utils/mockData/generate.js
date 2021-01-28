import { GROUPS, AGENTS, SCHEDULE } from './constants';

export const generateMockAgentsAndGroups = async ({ organization, domain = 'getstream.io' }, Group, Agent, stream) => {
	const groupIdMap = {};

	// eslint-disable-next-line no-unused-vars
	for (const key in GROUPS) {
		if (key) {
			const name = GROUPS[key];

			// eslint-disable-next-line no-await-in-loop
			const group = await Group.create({
				name,
				organization,
			});

			groupIdMap[name] = group._id;
		}
	}

	// eslint-disable-next-line no-unused-vars
	for await (const agent of AGENTS) {
		const [firstName] = agent.name.split(' ');

		// eslint-disable-next-line no-await-in-loop
		const { _doc: data } = await Agent.create({
			...agent,
			name: {
				full: agent.name,
				display: firstName,
			},
			organization,
			email: `${firstName.toLowerCase()}@${domain}`,
			password: 'password1',
			schedule: SCHEDULE,
			groups: agent.groups?.map(name => groupIdMap[name]) || groupIdMap['General'],
		});

		const agentId = data._id.toString();

		await stream.feeds.feed('organization', organization).follow('agent', agentId);

		await stream.feeds.feed('agent', agentId).addActivity({
			actor: agentId,
			object: agentId,
			entity: 'Agent',
			text: 'Agent Created',
			verb: 'combase:agent.created',
		});

		// eslint-disable-next-line no-await-in-loop
		await stream.chat.upsertUser({
			avatar: data.avatar,
			email: data.email,
			id: data._id.toString(),
			name: data.name.display,
			organization: organization.toString(),
			entity: 'Agent',
		});

		// eslint-disable-next-line no-await-in-loop
		await stream.chat.disconnect();
	}
};
