import { deepmerge } from 'graphql-compose';
import { FaqSerializer } from './serialize';

export const faqCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => rp => {
			const { agent, organization } = rp.context;

			/**
			 * Force createdBy and organization from the authenticated user in context.
			 */
			return next(
				deepmerge(rp, {
					args: {
						record: {
							createdBy: agent,
							organization,
						},
					},
				})
			);
		})
		.clone({ name: 'create' });
export const faqUpdate = tc =>
	tc.mongooseResolvers
		.updateOne()
		.wrap(resolve => {
			// eslint-disable-next-line no-param-reassign
			delete resolve.args.filter;
			// eslint-disable-next-line no-param-reassign
			resolve.args.shortId = 'String!';

			return resolve;
		})
		.wrapResolve(next => rp => {
			const { organization } = rp.context;

			const serializer = FaqSerializer.getSerializer('markdown');
			const serialized = serializer.serialize(rp.args.record.content[0].children);

			/**
			 * Force createdBy and organization from the authenticated user in context.
			 */
			return next(
				deepmerge(rp, {
					args: {
						record: {
							body: serialized,
						},
						filter: {
							shortId: rp.args.shortId,
							organization,
						},
					},
				})
			);
		})
		.clone({ name: 'update' });
export const faqRemove = tc => tc.mongooseResolvers.removeOne().clone({ name: 'remove' });
export const faqRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
