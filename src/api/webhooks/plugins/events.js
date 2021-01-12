import { connect as streamFeedsClient } from 'getstream';

// TODO @luke still uses test method

// TODO @luke can probably use the actual trigger names from Combase now rather than using the stream chat events directly i.e. ticket:created
export class CombaseActivityPlugin {
	streamChatEvents = ['channel.created', 'member.added', 'user.created'];

	createActivityFromEvent = async event => {
		const { data, organization } = event;
		const feeds = streamFeedsClient(organization.stream.key, organization.stream.secret);

		switch (data?.type) {
			case 'channel.created': {
				const { channel, type } = data;

				const userFeed = feeds.feed(channel.created_by.entity.toLowerCase(), channel.created_by.id);
				const organizationFeed = feeds.feed('organization', channel.organization);

				await userFeed.follow('ticket', channel.id);
				await organizationFeed.follow('ticket', channel.id);

				return userFeed.addActivity({
					actor: channel.created_by.id,
					object: channel.id,
					entity: 'Ticket',
					text: 'New Ticket',
					to: [`ticket:${channel.id}`],
					verb: type,
				});
			}

			case 'member.added': {
				const { channel_id, member, type } = data;

				/*
				 * If no agents are available, the chat is assigned to the organization until then
				 * but the `status` field remains `unassigned`
				 */
				const isAgent = member.user.entity === 'Agent';

				const asigneeFeed = feeds.feed(member.user.entity.toLowerCase(), member.user_id);

				if (isAgent) {
					/*
					 * The organization already follows the feed
					 * so we only call this if an agent was actually assigned
					 */
					await asigneeFeed.follow('ticket', channel_id);
				}

				return asigneeFeed.addActivity({
					actor: member.user_id,
					object: channel_id,
					entity: 'Ticket',
					text: !isAgent ? 'Missed Ticket' : 'Ticket Assigned',
					to: [`ticket:${channel_id}`],
					verb: type,
				});
			}

			default:
				return;
		}
	};

	test = ({ data }) => data?.type && this.streamChatEvents.includes(data?.type);

	listen = async capn => {
		const events = capn.listen(this.test);

		for await (const event of events) {
			// eslint-disable-next-line no-console
			console.log('CombaseActivityPlugin:', event.data.type, event.data);
			await this.createActivityFromEvent(event);
		}
	};
}
