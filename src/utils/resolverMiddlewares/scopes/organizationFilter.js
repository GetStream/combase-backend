import { deepmerge } from 'graphql-compose';

/**
 * Force the resolvers filter argument to incl. the current authenticated users organization id.
 * This will scope the results to the current users organization.
 * @param {*} resolve
 * @param {*} source
 * @param {*} args
 * @param {*} context
 * @param {*} info
 */
export const organizationFilter = (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthorized.');
	}

	// eslint-disable-next-line no-param-reassign
	const argsWithOrgFilter = deepmerge(args, { filter: { organization: context.organization } });

	return resolve(source, argsWithOrgFilter, context, info);
};
