export class CombaseActivityPlugin {
	streamChatEvents = ['channel.created', 'member.added'];

	createActivityFromEvent = event => {
		const { data } = event;

		switch (data?.type) {
			case 'channel.created': {
				const { channel, type } = data;

				return [
					`${channel.created_by.type}:${channel.created_by.id}`,
					{
						actor: channel.created_by.id,
						object: channel.id,
						text: 'New Ticket',
						to: [`organization:${channel.created_by.organization}`],
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
				await this.addToFeed(feed, activity);
			}
		}
	};
}
