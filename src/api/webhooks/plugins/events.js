import { connect as streamFeedsClient } from 'getstream';

export class CombaseActivityPlugin {
	streamChatEvents = ['channel.created', 'member.added', 'user.created'];

	createActivityFromEvent = async event => {
		const { data, organization } = event;
		const feeds = streamFeedsClient(organization.stream.key, organization.stream.secret);

		switch (data?.type) {
			case 'channel.created': {
				const { channel, type } = data;

				const userFeed = feeds.feed(channel.created_by.entity, channel.created_by.id);
				const organizationFeed = feeds.feed('organization', organization._id.toString());

				await userFeed.follow('ticket', channel.id);
				await organizationFeed.follow('ticket', channel.id);

				return userFeed.addActivity({
					actor: channel.created_by.id,
					object: channel.id,
					text: 'New Ticket',
					to: [`ticket:${channel.id}`],
					verb: type,
				});
			}

			case 'member.added': {
				const { channel_id, member, type } = data;

				const agentFeed = feeds.feed(member.user.entity, member.user.id);

				await agentFeed.follow('ticket', channel_id);

				return agentFeed.addActivity({
					actor: member.user.id,
					// eslint-disable-next-line camelcase
					object: channel_id,
					text: 'Ticket Assigned',
					// eslint-disable-next-line camelcase
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
