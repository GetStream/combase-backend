import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { getTokenPayload } from 'utils/auth';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
	});

	tc.addFields({
		token: {
			type: 'String',
			projection: {
				_id: true,
				organization: true,
			},
			resolve: (source, _, context) => {
				if (!context?.agent || context.agent !== source._id.toString()) {
					return null;
				}

				return jwt.sign(getTokenPayload(source, 'agent'), process.env.AUTH_SECRET);
			},
		},
	});
};
