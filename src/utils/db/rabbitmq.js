import rascal, { BrokerAsPromised as Broker } from 'rascal';

const rabbitmq = async (URI = process.env.AMQP_URI) => {
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
				throw new Error(error);
			})
			.on('error', error => {
				throw new Error(error);
			});

		return { client };
	} catch (error) {
		throw new Error(error);
	}
};

export { rabbitmq };
