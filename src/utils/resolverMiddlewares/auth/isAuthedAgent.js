import { AuthenticationError } from 'apollo-server-express';

export const isAuthedAgent = (resolve, source, args, context, info) => {
	if (!context.organization || !context.agent) {
		throw new AuthenticationError('Unauthorized.');
	}

	return resolve(source, args, context, info);
};
