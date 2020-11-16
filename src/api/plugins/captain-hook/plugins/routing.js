import { Models } from 'api/schema';

export default class CombaseRoutingPlugin {
	findAgent = async event => {
		// eslint-disable-next-line no-console
		console.log(`new chat: ${event.channel.id} • Finding Agent `);

		const agent = await Models.Agent.findOne().lean();

		// eslint-disable-next-line no-console
		console.log('found agent:', agent);
	};

	receive = async (req, res, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			switch (event.type) {
				case 'channel.created':
					await this.findAgent(event);

					return next();
				default:
					return next();
			}
		}
	};
}
