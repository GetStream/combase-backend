export class CombaseTestChangeStream {
	constructor(capn) {
		this.capn = capn;

		this.listen();
	}

	listen = async () => {
		const events = this.capn.listen(['user:created', 'user:updated', 'user:deleted']);

		for await (const event of events) {
			// eslint-disable-next-line no-console
			console.log('CHANGE STREAM CAPN EVENT:', event);
		}
	};
}
