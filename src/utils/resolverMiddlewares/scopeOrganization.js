import { deepmerge } from 'graphql-compose';

export const scopeOrganization = next => rp => {
	// eslint-disable-next-line no-param-reassign
	rp.args = deepmerge(rp.args, { filter: { organization: rp.context.organization } });

	return next(rp);
};
