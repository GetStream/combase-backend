const webhook = (req, res, next) => {
	try {
		const {
			path,
			authorization: { headers: auth },
		} = req;

		if (path !== '/hooks') return next();

		// eslint-disable-next-line no-console
		console.log(auth);

		/*
		 * figure out who the webhook is coming from using identifer
		 * check for auth type and response
		 * route and send along req, res, etc.
		 */

		return next();
	} catch (error) {
		throw new Error(error);
	}
};

export { webhook };
