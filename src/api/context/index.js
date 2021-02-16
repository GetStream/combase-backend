/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { logger } from 'utils/logger';
import { streamCtx } from 'utils/streamCtx';

import { Models } from '../schema';

const authorizeRequest = async ({ req, connection }) => {
	try {
		let token;
		let organization;

		if (connection) {
			token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
			organization = connection.context['combase-organization'] ? connection.context['combase-organization'] : '';
		} else {
			token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
			organization = req.headers['combase-organization'] ? req.headers['combase-organization'] : '';
		}

		let scopes = {
			organization,
		};

		if (token) {
			const payload = token ? jwt.verify(token, process.env.AUTH_SECRET) : null;

			scopes = {
				...scopes,
				[payload?.type || 'user']: payload?.sub,
				organization: payload?.organization || organization,
			};
		}

		let orgData;
		const timezone = 'Europe/Amsterdam'; // TODO: For agent, get timezone / For user, send timezone from the widget

		if (scopes?.organization) {
			orgData = await Models.Organization.findOne({ _id: scopes.organization }, { stream: true });
		}

		return {
			...scopes,
			timezone,
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
			stream: streamCtx(stream?.key, stream?.secret, stream?.appId),
		};
	} catch (error) {
		logger.error(error.message);
		throw new Error(error);
	}
};
