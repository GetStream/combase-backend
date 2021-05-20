import 'dotenv/config';
import { MeiliSearch } from 'meilisearch';

export const meilisearch = new MeiliSearch({ host: process.env.MEILI_HOST });

export const createSearchResolver = tc =>
	tc.mongooseResolvers
		.connection()
		.wrap(resolve => {
			// eslint-disable-next-line no-param-reassign
			resolve.args = {
				query: 'String!',
			};

			return resolve;
		})
		// eslint-disable-next-line no-unused-vars
		.wrapResolve(next => async rp => {
			/*
			 * next === the original connection resolver
			 * we can pass the _ids from the found hits in Meili to the connection to enrich the full agent object incl. relations etc.
			 */
			const index = tc.getTypeName().toLowerCase();
			const { hits } = await rp.context.meilisearch.index(index).search(rp.args.query);

			const _ids = hits.map(hit => hit._id);

			const newRp = {
				...rp,
				args: {
					filter: {
						_operators: {
							_id: {
								in: _ids,
							},
						},
					},
				},
			};

			return next(newRp);
		})
		.clone({ name: 'search' });
