import { connect as streamFeedsClient } from 'getstream';

export class CombaseActivityPlugin {
	streamChatEvents = ['channel.created', 'member.added'];

	createActivityFromEvent = event => {
		const { data, organization } = event;
		const feeds = streamFeedsClient(organization.stream.key, organization.stream.secret);

		switch (data?.type) {
			case 'channel.created': {
				const { channel, type } = data;

				return [
					feeds.feed(channel.created_by.entity, channel.created_by.id),
					{
						actor: channel.created_by.id,
						object: channel.id,
						text: 'New Ticket',
						to: [`organization:${organization._id.toString()}`],
						verb: type,
					},
				];
			}

			default:
				return [];
		}
	};

	addToFeed = (feed, activity) => {
		// eslint-disable-next-line no-console
		console.log(`${feed}: activity created:`, activity);
	};

	test = ({ data }) => data?.type && this.streamChatEvents.includes(data?.type);

	listen = async capn => {
		const events = capn.listen(this.test);

		for await (const event of events) {
			// eslint-disable-next-line no-console
			console.log('CombaseActivityPlugin:', event.data.type);
			const [feed, activity] = await this.createActivityFromEvent(event);

			if (feed && activity) {
				await feed.addActivity(activity);
			}
		}
	};
}
