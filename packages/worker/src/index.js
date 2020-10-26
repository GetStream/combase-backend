import { webhook } from './webhook';

(async () => {
	try {
		await webhook();
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
	}
})();
