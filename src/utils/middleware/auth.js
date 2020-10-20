import 'dotenv/config';
import jwt from 'jsonwebtoken';

/*
 * 1. allow for write only from a specific internal auth jwt (we will inforce more later using domain, etc.)
 * 2. all tokens are signed by the AUTH_SECRET environment variable and are JWTs
 * 3. a JWT should always contain and org and a user id, unless it is a server / system token
 * 4. if a valid JWT, check user permissions - introduce https://github.com/maticzav/graphql-shield on the user level
 */

// eslint-disable-next-line no-unused-vars
export const auth = (req, res, next) => {
	const decoded = jwt.verify(req.headers.authorization, process.env.AUTH_SECRET);

	return decoded;
	//return next();
};
