import { PubSub } from './pubsub';

const mongooseEventsPlugin = schema => {
	const {
		options: { collection: name },
	} = schema;

	const ref = name.toUpperCase();

	schema.post('save', (doc, next) => {
		const state = doc.new ? 'CREATED' : 'UPDATED';

		const event = `INTERNAL_EVENT.${ref.slice(0, -1)}_${state}`;

		const payload = {
			_id: doc._id,
			ref,
			collection: name,
		};

		PubSub.publish(event, payload);

		next();
	});
};

export { mongooseEventsPlugin };
