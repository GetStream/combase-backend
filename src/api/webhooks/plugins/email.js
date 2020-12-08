export class CombaseEmailPlugin {
	handleWebhook = ({ data }) => {
		// DO IT HERE
	};

	// data === req.body
	test = ({ data }) => true;

	listen = async capn => {
		const events = capn.listen(this.test);

		for await (const event of events) {
			// eslint-disable-next-line no-console
			console.log('CombaseEmailPlugin:', event);
			await this.handleWebhook(event);
		}
	};
}
