import { GROUPS, AGENTS, SCHEDULE } from './constants';

export const generateMockAgentsAndGroups = async ({ organization, domain = 'getstream.io' }, Group, Agent, stream) => {
	const groupIdMap = {};

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
			hours: SCHEDULE,
			groups: agent.groups?.map(name => groupIdMap[name]) || groupIdMap['General'],
		});

		await stream.feeds.feed('organization', organization).follow('agent', data._id.toString());

		// eslint-disable-next-line no-await-in-loop
		await stream.chat.setUser({
			avatar: data.avatar,
			email: data.email,
			id: data._id.toString(),
			name: data.name.display,
			organization: organization.toString(),
			type: 'agent',
		});

		// eslint-disable-next-line no-await-in-loop
		await stream.chat.disconnect();
	}
};
