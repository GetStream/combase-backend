import { GROUPS, AGENTS, SCHEDULE } from './constants';

export const generateMockAgentsAndGroups = async ({ organization, domain }, Group, Agent, streamChat) => {
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

	for (const agent of AGENTS) {
		const [firstName] = agent.name.split(' ');

		// eslint-disable-next-line no-await-in-loop
		const { _doc: data } = await Agent.create({
			...agent,
			name: {
				full: agent.name,
				display: firstName,
			},
			organization,
			email: `${firstName.toLowerCase()}@${domain || 'getstream.io'}`,
			password: 'password1',
			hours: SCHEDULE,
			groups: agent.groups?.map(name => groupIdMap[name]) || groupIdMap['General'],
		});

		// eslint-disable-next-line no-await-in-loop
		await streamChat.setUser({
			avatar: data.avatar,
			email: data.email,
			id: data._id.toString(),
			name: data.name.display,
			organization: organization.toString(),
			type: 'agent',
		});

		// eslint-disable-next-line no-await-in-loop
		await streamChat.disconnect();
	}
};