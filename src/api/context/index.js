/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { Models } from '../schema';
import logger, { stream as streamCtx } from 'utils';

const authorizeRequest = async ({ req, connection }) => {
	try {
		let token;

		if (connection) {
			token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
		} else {
			token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
		}

		let scopes = {};

		if (!token) {
			// User
			scopes = { organization: req.headers['combase-organization'] }; // TODO: use referrer from headers...
		} else {
			// Agent

			const { sub: agent, organization } = jwt.verify(token, process.env.AUTH_SECRET);

			scopes = {
				agent,
				organization,
			};
		}

		let orgData;

		if (scopes?.organization) {
			orgData = await Models.Organization.findOne({ _id: scopes.organization }, { stream: true });
		}

		return {
			...scopes,
			stream: orgData?.stream,
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
			stream: streamCtx(stream?.key, stream?.secret),
		};
	} catch (error) {
		logger.error(error);
		throw new Error(error);
	}
};
