import PubSub from '../PubSub';

const mongooseEvents = schema => {
	const {
		options: { collection: name },
	} = schema;

	const ref = name.toUpperCase();

	schema.post('save', (doc, next) => {
		const state = doc.isNew ? 'CREATED' : 'UPDATED';

		const event = `INTERNAL_EVENT.${ref.slice(0, -1)}_${state}`;
		const payload = {
			id: doc._id,
			ref,
			collection: name,
		};

		// eslint-disable-next-line no-unused-expressions
		new PubSub(event, payload).publish;

		next();
	});
};

export { mongooseEvents };
