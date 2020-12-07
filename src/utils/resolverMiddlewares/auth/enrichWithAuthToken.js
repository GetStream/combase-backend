import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { getTokenPayload } from '../../auth';

export const enrichWithAuthToken = async (resolve, source, args, context, info) => {
	const data = await resolve(source, args, context, info);

	const token = jwt.sign(getTokenPayload(data.record._doc), process.env.AUTH_SECRET);

	data.record.token = token;

	return data;
};
