import { createChildTagRelationship } from 'utils/createTaggableEntity';

export const extend = tc => {
	tc.addRelation('userData', {
		prepareArgs: {
			_id: ({ user }) => user,
		},
		projection: { user: true },
		resolver: () => tc.schemaComposer.getOTC('User').getResolver('get'),
	});

	tc.setField('createdAt', {
		type: 'DateTime',
	});

	tc.setField('updatedAt', {
		type: 'DateTime',
	});

	tc.addFields({
		messages: tc.schemaComposer.createResolver({
			name: 'getTicketMessages',
			type: 'JSON',
			kind: 'query',
			args: {},
			resolve: async ({ source, context }) => {
				const { _id: channelId } = source;
				const { chat } = context.stream || {};

				if (!chat) {
					throw new Error('Unauthorized');
				}

				const [channel] = await chat.queryChannels(
					{ id: { $eq: channelId } },
					{},
					{
						watch: false,
						state: true,
						options: {
							message_limit: 300,
						},
					}
				);

				return channel.state.messages;
			},
		}),
	});
};

export const childTags = createChildTagRelationship;
