import 'dotenv/config';
import { PubSub } from './pubsub';
import { stream as streamCtx } from 'utils/stream';

const stream = streamCtx(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID);

const mongooseEventsPlugin = schema => {
	const {
		options: { collection: name },
	} = schema;

	const ref = name.toUpperCase();

	schema.post('save', async (doc, next) => {
		const operation = doc.new ? 'CREATED' : 'UPDATED';
		const entity = ref.slice(0, -1);

		const eventName = `${entity}_${operation}`;

		const event = `INTERNAL_EVENT.${eventName}`;

		const payload = {
			_id: doc._id,
			ref,
			collection: name,
		};

		PubSub.publish(event, payload);

		// TODO This is kinda janky rn.
		const _id = doc._id.toString();

		if (entity === 'AGENT') {
			await stream.feeds.addToMany(
				{
					object: eventName,
					verb: 'event',
					actor: _id,
				},
				[`${entity.toLowerCase()}:${_id}`, `organization:${doc.organization}`]
			);
		}

		if (entity === 'USER') {
			await stream.feeds.addToMany(
				{
					object: eventName,
					verb: 'event',
					actor: _id,
				},
				[`${entity.toLowerCase()}:${_id}`, `organization:${doc.organization}`]
			);
		}

		if (entity === 'ORGANIZATION') {
			await stream.feeds.feed(entity.toLowerCase(), _id).addActivity({
				object: eventName,
				verb: 'event',
				actor: _id,
			});
		}

		next();
	});
};

export { mongooseEventsPlugin };
