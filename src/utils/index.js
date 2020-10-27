import { mongodb, rabbitmq } from './db';
import { mongooseEvents } from './mongoose-plugins';
import { getTokenPayload } from './auth';
import { logger } from './logger';
import PubSub from './PubSub';
import { s3 } from './s3';
import { stream } from './stream';

export default {
	mongodb,
	rabbitmq,
	mongooseEvents,
	getTokenPayload,
	logger,
	PubSub,
	s3,
	stream,
};
