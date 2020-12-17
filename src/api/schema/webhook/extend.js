import jwt from 'jsonwebtoken';

import { WebhookTC } from './model';

WebhookTC.addFields({
	token: {
		type: 'String',
		resolve: ({ _id }, _, { organization }) =>
			jwt.sign(
				{
					organization: organization.toString(),
					webhook: _id.toString(),
				},
				process.env.AUTH_SECRET
			),
	},
});
