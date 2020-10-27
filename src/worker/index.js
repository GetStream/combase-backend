import { logger } from 'utils';
import { webhook } from './webhook';

(async () => {
	try {
		await webhook();
	} catch (error) {
		logger.error(error); // eslint-disable-line no-console
	}
})();
