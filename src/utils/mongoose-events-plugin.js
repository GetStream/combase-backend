import { streamCtx } from 'api/plugins/graphql-stream';

const stream = streamCtx(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID);

const mongooseEventsPlugin = schema => {
	const {
		options: { collection: name },
	} = schema;

	const entity = name.toUpperCase().slice(0, -1);

	schema.post('save', async (doc, next) => {
		const _id = doc._id.toString();
		const isNew = doc.createdAt === doc.updatedAt;

		const operation = isNew ? 'CREATED' : 'UPDATED';
		const event = `${entity}_${operation}`;

		if (entity === 'AGENT') {
			await stream.feeds.addToMany(
				{
					object: _id,
					verb: event,
					actor: _id,
				},
				[`${entity.toLowerCase()}:${_id}`, `organization:${doc.organization}`]
			);
		}

		if (entity === 'USER') {
			await stream.feeds.addToMany(
				{
					object: _id,
					verb: event,
					actor: _id,
				},
				[`${entity.toLowerCase()}:${_id}`, `organization:${doc.organization}`]
			);
		}

		if (entity === 'ORGANIZATION') {
			await stream.feeds.feed(entity.toLowerCase(), _id).addActivity({
				object: _id,
				verb: event,
				actor: _id,
			});
		}

		next();
	});
};

export { mongooseEventsPlugin };
