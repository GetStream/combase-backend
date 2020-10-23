import 'dotenv/config';
import rascal from 'rascal';

const vhost = process.env.AMQP_URI.split('.com/')[1];

const config = {
	vhosts: {
		[vhost]: {
			connection: process.env.AMQP_URI,
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

export default rascal.withDefaultConfig(config);
