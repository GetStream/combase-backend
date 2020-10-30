const webhook = (req, res, next) => {
	try {
		const {
			path,
			headers: { authorization: auth },
		} = req;

		if (path !== '/hooks') return next();

		// eslint-disable-next-line no-console
		console.log(auth);

		/*
		 * figure out who the webhook is coming from using identifer
		 * check for auth type and response
		 * route and send along req, res, etc.
		 * get webhook id from querystring and do lookup against webhook model
		 */

		return next();
	} catch (error) {
		throw new Error(error);
	}
};

export { webhook };
