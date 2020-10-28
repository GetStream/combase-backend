import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const pubsub = (URI = process.env.REDIS_URI) => {
	const instance = new Redis(URI);

	const client = new RedisPubSub({
		publisher: instance,
		subscriber: instance,
	});

	return client;
};

export { pubsub };
