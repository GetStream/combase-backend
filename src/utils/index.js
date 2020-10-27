import { mongodb, rabbitmq } from './db';
import { events } from './mongoose-plugins';
import { getTokenPayload } from './auth';
import { logger } from './logger';
import PubSub from './PubSub';
import { s3 } from './s3';
import { stream } from './stream';

export default {
	db: {
		mongodb,
		rabbitmq,
	},
	mongoose: {
		plugins: { events },
	},
	auth: { getTokenPayload },
	logger,
	PubSub,
	s3,
	stream,
};
