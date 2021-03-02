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

import { OrganizationModel } from 'api/schema/organization/model';
import { AgentModel } from 'api/schema/agent/model';

const authorizeRequest = async ({ req, connection }) => {
	try {
		let token, organization, domain, timezone;

		if (connection) {
			token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
			organization = connection.context['combase-organization'] ? connection.context['combase-organization'] : '';
		} else {
			const [protocol, maybePortToo] = req.headers.origin.split('://');

			domain = maybePortToo.split(':')[0];

			if (process.env.NODE_ENV === 'production' && !protocol.endsWith('s')) {
				throw new Error('Unauthorized domain.');
			}

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

		// TODO: User timezone

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
			orgData = await OrganizationModel.findOne(
				{
					_id: scopes.organization,
					'widget.domains': {
						$in: [domain],
					},
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

export default async ({ connection, req }) => {
	try {
		const { stream, ...scopes } = await authorizeRequest({
			connection,
			req,
		});

		return {
			...scopes,
			s3,
			stream: streamCtx(stream?.key, stream?.secret, stream?.appId),
		};
	} catch (error) {
		logger.error(error.message);
		throw new Error(error);
	}
};
