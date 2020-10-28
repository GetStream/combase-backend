import 'dotenv/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const createClient = (URI = process.env.REDIS_URI) => {
	const publisher = new Redis(URI);
	const subscriber = new Redis(URI);

	const client = new RedisPubSub({
		publisher,
		subscriber,
	});

	return client;
};

export const PubSub = createClient();
