import 'dotenv/config';
import { AMQPPubSub } from 'graphql-amqp-subscriptions';
import { rabbitConnection } from 'utils/db';

import { logger } from './logger';

const pubsub = async () => {
	try {
		const amqp = await rabbitConnection();

		const client = new AMQPPubSub({
			connection: amqp,
		});

		return client;
	} catch (error) {
		logger.error(error);

		return error;
	}
};

export default pubsub;
