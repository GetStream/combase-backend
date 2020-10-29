import 'dotenv/config';
import { PubSub } from './pubsub';
import { stream as streamCtx } from 'utils/stream';

const stream = streamCtx(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_TOKEN);

const mongooseEventsPlugin = schema => {
	const {
		options: { collection: name },
	} = schema;

	const ref = name.toUpperCase();

	schema.post('save', async (doc, next) => {
		const state = doc.new ? 'CREATED' : 'UPDATED';

		const event = `INTERNAL_EVENT.${ref.slice(0, -1)}_${state}`;

		const payload = {
			_id: doc._id,
			ref,
			collection: name,
		};

		PubSub.publish(event, payload);

		await stream.feeds.feed('agent', 'test').addActivity({
			object: `${ref.slice(0, -1)}_${state}`,
			verb: 'event',
			actor: doc._id,
		});

		next();
	});
};

export { mongooseEventsPlugin };
