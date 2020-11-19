import { AuthenticationError } from 'apollo-server-express';

export const hasOrganization = next => rp => {
	if (!rp.context.organization) {
		throw new AuthenticationError('Unauthorized.');
	}

	return next(rp);
};
