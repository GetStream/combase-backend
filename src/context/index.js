/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import 'dotenv/config';
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

		const { sub: agent, organization } = jwt.verify(token, process.env.AUTH_SECRET);

		if (!agent || !organization) {
			return {};
		}

		const org = await Models.Organization.findOne({ _id: organization }, { stream: true });

		return {
			agent,
			organization,
			stream: org?.stream,
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
			stream: getStreamContext(stream?.key, stream?.secret),
		};
	} catch (error) {
		logger.error(error);
		throw new Error(error);
	}
};
