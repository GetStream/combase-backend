import { logger } from 'utils/logger';

import webhooks from './webhooks';

export default async (req, res, next) => {
	try {
		const { path } = req;

		if (path.includes('webhooks')) {
			await webhooks(req);
		}
	} catch (error) {
		logger.error(error.message);
	}

	return next();
};
