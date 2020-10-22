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
						exchange: {
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
					publications: {
						event: {
							vhost,
							queue: 'event',
							timeout: 10000,
							confirm: true,
						},
						webhook: {
							vhost,
							queue: 'webhook',
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
					bindings: {
						event: {
							source: 'exchange',
							destination: 'event',
							destinationType: 'queue',
							bindingKey: 'event',
						},
						webhook: {
							source: 'exchange',
							destination: 'webhook',
							destinationType: 'queue',
							bindingKey: 'webhook',
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

		return client;
	} catch (error) {
		logger.error(error);

		return error;
	}
};

export { rabbitConnection };
