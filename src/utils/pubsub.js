import 'dotenv/config';
import { AMQPPubSub } from 'graphql-amqp-subscriptions';
import amqp from 'amqplib';
import { rabbitConnection } from 'utils/db';

import { logger } from './logger';

const pubsub = async () => {
	try {
		const rascal = await rabbitConnection();
		const amqpConn = await amqp.connect(rascal.conn);

		const client = new AMQPPubSub({
			connection: amqpConn,
		});

		return client;
	} catch (error) {
		logger.error(error);

		return error;
	}
};

export default pubsub;
