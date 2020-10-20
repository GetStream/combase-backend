/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const authorizeRequest = ({ req, connection }) => {
	try {
		let token;

		if (connection) {
			token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
		} else {
			token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
		}

		if (!token) {
			return {};
		}

		const { sub: user } = jwt.verify(token, process.env.AUTH_SECRET);

		if (!user) {
			return {};
		}

		return {
			user,
		};
	} catch (error) {
		throw new AuthenticationError(error);
	}
};

export default async ({ connection, req }) => {
	const context = await authorizeRequest({
		connection,
		req,
	});

	return context;
};
