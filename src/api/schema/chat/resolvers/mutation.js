import { ChatTC } from '../model';

/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the Chat object so we can connect to the channel on the client-side.
 */

export const createChat = {
	name: 'createChat',
	type: ChatTC,
	kind: 'mutation',
	args: {
		message: 'String',
		user: 'MongoID!',
	},
	resolve: async (_, { message, user }, { models: { Chat }, organization, stream }) => {
		try {
			const status = 'unassigned';
			const tags = [];

			const { _doc: chat } = await Chat.create({
				organization,
				user,
				status,
				tags,
			});

			await stream.chat.setUser({ id: user });

			const channel = stream.chat.channel('messaging', chat._id.toString(), {
				created_by_id: user, // eslint-disable-line camelcase
				members: [user],
				status,
				tags,
			});

			await channel.create();

			if (message) {
				channel.sendMessage({
					text: message,
					user_id: user, // eslint-disable-line camelcase
				});
			}

			return chat;
		} catch (error) {
			throw new Error(`Chat creation failed: ${error.message}`);
		}
	},
};

export const addToChat = {
	name: 'addToChat',
	type: ChatTC,
	kind: 'Mutation',
	args: {
		agent: 'MongoID!',
		chat: 'MongoID!',
		status: 'EnumChatStatus',
	},
	// TODO Show status has a default of open
	resolve: async (_, { chat, agent, status = 'open' }, { models: { Agent, Chat }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', chat.toString());

			const updates = {};

			if (status) updates.status = status;

			const { name: agentName } = await Agent.findById(agent, { 'name.display': true });

			const addMember = channel.addModerators([agent.toString()]);

			// TODO: We should creete 'sub-types' of system messages with a custom field so we can render them differently, would be cool to show the agent avatar when they get added etc.
			const updateChannel = channel.update(updates, {
				subtype: 'agent_added',
				text: `${agentName?.display || 'An agent'} joined the chat.`,
				user_id: agent, // eslint-disable-line camelcase
			});

			await Promise.all([addMember, updateChannel]);

			return Chat.findByIdAndUpdate(
				chat,
				{
					$push: {
						agents: [agent],
					},
					...updates,
				},
				{ new: true }
			).lean();
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const chatAddLabel = {
	name: 'chatAddLabel',
	description: 'Add a label to a chat channel.',
	type: ChatTC,
	kind: 'mutation',
	args: {
		chat: 'MongoID!',
		label: 'EnumChatLabels!',
	},
	resolve: async (_, { chat, label }, { models: { Chat }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', chat);

			await channel.watch();

			/*
			 * Ensure that labels are always unique, if the user calls chatAddLabel
			 * again for the same toggle, it will result in no change.
			 */
			const labels = [...new Set([...(channel.data?.labels || []), label])];

			await channel.update({
				...channel.data,
				labels,
			});

			return Chat.findByIdAndUpdate(
				chat,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const chatRemoveLabel = {
	name: 'chatRemoveLabel',
	description: 'Remove a label from a chat channel.',
	type: ChatTC,
	kind: 'mutation',
	args: {
		chat: 'MongoID!',
		label: 'EnumChatLabels!',
	},
	resolve: async (_, { chat, label }, { models: { Chat }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', chat);

			await channel.watch();

			const labels = channel.data.labels.filter(l => l !== label);

			await channel.update({
				...channel.data,
				labels,
			});

			return Chat.findByIdAndUpdate(
				chat,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const chatToggleLabel = {
	name: 'chatToggleLabel',
	description: 'Toggle a label on a chat channel.',
	type: ChatTC,
	kind: 'mutation',
	args: {
		chat: 'MongoID!',
		label: 'EnumChatLabels!',
	},
	resolve: async (_, { chat, label }, { models: { Chat }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', chat);

			await channel.watch();

			let labels = channel.data?.labels || [];

			if (labels.includes(label)) {
				labels = channel.data.labels.filter(l => l !== label);
			} else {
				labels = [...new Set([...labels, label])];
			}

			await channel.update({
				...channel.data,
				labels,
			});

			return Chat.findByIdAndUpdate(
				chat,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
