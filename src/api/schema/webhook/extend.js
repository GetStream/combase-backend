import jwt from 'jsonwebtoken';

import { WebhookTC } from './model';

WebhookTC.addFields({
	token: {
		type: 'String',
		resolve: ({ _id, provider }, _, { organization }) =>
			jwt.sign(
				{
					iss: process.env.BASE_URL, // base domain [combase.app]
					sub: _id.toString(), // webhook id
					aud: provider, // name of the provider [foo.com]
					iat: Date.now(), // issued at time [now]
					org: organization.toString(), // organization id
				},
				process.env.AUTH_SECRET // signing key
			),
	},
});
