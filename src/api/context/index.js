/* eslint-disable multiline-comment-style */
/**
 * Create context for each request through the apollo server,
 * here we process the users JWT, add their userID to the context
 * object available in each resolver.
 */
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { logger } from 'utils/logger';
import { streamCtx } from 'utils/streamCtx';
import s3 from 'utils/s3';
import { algolia } from 'utils/search';

import { OrganizationModel } from 'api/schema/organization/model';
import { AgentModel } from 'api/schema/agent/model';

const authorizeRequest = async ({ req, connection }) => {
	try {
		let token, organization, timezone;

		if (connection) {
			token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
			organization = connection.context['combase-organization'] ? connection.context['combase-organization'] : '';
		} else {
			// const [protocol, domainAndPort] = req.headers?.origin?.split('://') || [];

			// if (process.env.NODE_ENV === 'production' && !protocol?.endsWith('s')) {
			// 	throw new Error('Unauthorized domain.');
			// }

			// domain = domainAndPort?.split(':')[0];

			token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
			organization = req.headers['combase-organization'] ? req.headers['combase-organization'] : '';
			timezone = req.headers['combase-timezone'] ? req.headers['combase-timezone'] : '';
		}

		let scopes = {
			timezone,
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
		let access;

		if (token && scopes?.agent) {
			access = await AgentModel.findOne(
				{
					_id: scopes.agent,
					organization: scopes.organization,
				},
				{
					access: true,
					timezone: true,
				}
			).lean();

			delete access._id;
		}

		if (scopes?.organization) {
			// const orgQuery = {
			// 	_id: scopes.organization,
			// };

			// if (process.env.NODE_ENV === 'production') {
			// 	orgQuery['widget.domains'] = {
			// 		$in: [domain],
			// 	};
			// }

			orgData = await OrganizationModel.findOne(
				{
					_id: scopes.organization,
				},
				{ stream: true }
			);

			if (!orgData) {
				throw new Error('Unauthorized');
			}
		}

		return {
			...scopes,
			...access,
			stream: orgData?.stream,
		};
	} catch (error) {
		throw new AuthenticationError(error);
	}
};

const createContext = async ({ connection, req }) => {
	try {
		const { stream, ...scopes } = await authorizeRequest({
			connection,
			req,
		});

		return {
			...scopes,
			algolia,
			s3,
			stream: streamCtx(stream?.key, stream?.secret, stream?.appId),
		};
	} catch (error) {
		logger.error(error);
		throw new Error(error);
	}
};
/* eslint-enable multiline-comment-style */

export default createContext;
