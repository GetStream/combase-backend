import worker from './worker';

(async () => {
	try {
		await worker();
	} catch (error) {
		console.error(error);
	}
})();
