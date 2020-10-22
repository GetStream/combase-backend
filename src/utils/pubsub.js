import 'dotenv/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const pubsub = new RedisPubSub({
	publisher: new Redis(process.env.REDIS_URI),
	subscriber: new Redis(process.env.REDIS_URI),
});

export default pubsub;
