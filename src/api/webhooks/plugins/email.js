export class CombaseEmailPlugin {
	// eslint-disable-next-line no-unused-vars
	handleWebhook = ({ data }) => {
		// DO IT HERE
	};

	// data === req.body
	// eslint-disable-next-line no-unused-vars
	test = ({ data }) => true;

	listen = async capn => {
		const events = capn.listen(this.test);

		try {
			for await (const event of events) {
				// eslint-disable-next-line no-console
				console.log('CombaseEmailPlugin:', event);
				await this.handleWebhook(event);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	};
}
