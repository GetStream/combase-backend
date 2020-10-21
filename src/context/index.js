/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { Models } from 'schema';
import { logger } from 'utils/logger';
import { getStreamContext } from 'utils/stream';

const authorizeRequest = async ({ req, connection }) => {
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

		const { agent, organization } = jwt.verify(token, process.env.AUTH_SECRET);

		if (!agent || !organization) {
			return {};
		}

		const { stream } = await Models.Organization.findOne({ _id: organization }, { stream: 1 });

		return {
			agent,
			organization,
			stream,
		};
	} catch (error) {
		throw new AuthenticationError(error);
	}
};

export default async ({ connection, req }) => {
	try {
		const { agent, organization, stream } = await authorizeRequest({
			connection,
			req,
		});

		return {
			agent,
			organization,
			models: Models,
			stream: getStreamContext(stream.key, stream.secret),
		};
	} catch (error) {
		logger.error(error);
		throw new Error(error);
	}
};
