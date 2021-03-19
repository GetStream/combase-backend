import { deepmerge } from 'graphql-compose';

export const faqCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
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
export const faqUpdate = tc => tc.mongooseResolvers.updateOne().clone({ name: 'update' });
export const faqRemove = tc => tc.mongooseResolvers.removeOne().clone({ name: 'remove' });
export const faqRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
