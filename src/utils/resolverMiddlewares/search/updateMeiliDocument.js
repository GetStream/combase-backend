/**
 * Keeps MeiliSearch documents in sync with mongo for a given index.
 */
export const updateMeiliDocument = (index, fields = ['_id']) => {
	if (!index) {
		throw new Error('No Meili index provided to updateMeiliDocument middleware.');
	}

	if (!fields.length) {
		// eslint-disable-next-line no-param-reassign
		fields = ['_id'];
	}

	return async (resolve, source, args, context, info) => {
		const data = await resolve(source, args, context, info);

		const { _doc } = data.record;
		const { meilisearch } = context;

		try {
			const doc = {};

			fields.forEach(field => {
				doc[field] = _doc[field];
			});

			await meilisearch.index(index).updateDocuments([doc]);
		} catch (error) {
			throw new Error(`Combase MeiliSearch: Error updating document in "${index}" index.`);
		}

		return data;
	};
};
