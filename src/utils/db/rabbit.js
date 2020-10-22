import 'dotenv/config';
import rascal, { BrokerAsPromised as Broker } from 'rascal';
import { logger } from 'utils/logger';

const rabbitConnection = async (URI = process.env.AMQP_URI) => {
	try {
		const vhost = URI.split('.com/')[1];

		const config = {
			vhosts: {
				[vhost]: {
					connection: URI,
					exchanges: {
						event: {
							assert: true,
							check: true,
							options: {
								durable: true,
							},
						},
						webhook: {
							assert: true,
							check: true,
							options: {
								durable: true,
							},
						},
					},
					queues: {
						event: {
							assert: true,
							check: true,
							options: {
								durable: true,
							},
						},
						webhook: {
							assert: true,
							check: true,
							options: {
								durable: true,
							},
						},
					},
					bindings: ['event[event] -> event', 'webhook[webhook] -> webhook'],
					publications: {
						event: {
							vhost,
							queue: 'event',
							routingKey: 'event',
							timeout: 10000,
							confirm: true,
						},
						webhook: {
							vhost,
							queue: 'webhook',
							routingKey: 'webhook',
							timeout: 10000,
							confirm: true,
						},
					},
					subscriptions: {
						event: {
							vhost,
							queue: 'event',
							contentType: 'application/json',
						},
						webhook: {
							vhost,
							queue: 'webhook',
							contentType: 'application/json',
						},
					},
				},
			},
		};

		const client = await Broker.create(rascal.withDefaultConfig(config));

		client
			.on('blocked', error => {
				logger.error(error);
			})
			.on('error', error => {
				logger.error(error);
			});

		return {
			client,
			conn: config.vhosts[vhost].connection,
		};
	} catch (error) {
		logger.error(error);

		return error;
	}
};

export { rabbitConnection };
