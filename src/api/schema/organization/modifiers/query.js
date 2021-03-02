import { deepmerge } from 'graphql-compose';

export const organization = tc =>
	tc.mongooseResolvers
		.findById()
		.removeArg('_id')
		.wrapResolve(next => rp => {
			if (!rp.context.organization) {
				throw new Error('Unauthorized');
			}

			return next(deepmerge(rp, { args: { _id: rp.context.organization } }));
		})
		.clone({ name: 'get' });
