import 'dotenv/config';

import { ClientWrapper } from './ClientWrapper';

class TokenGenerator {
	constructor(uid) {
		this.uid = uid.toString();

		this.clients = new ClientWrapper().init;
	}

	chat() {
		const token = this.clients.chat.createToken(this.uid);

		return token;
	}

	feeds() {
		const token = this.clients.feeds.createUserToken(this.uid);

		return token;
	}

	get() {
		return {
			chat: this.chat(),
			feeds: this.feeds(),
		};
	}
}

export { TokenGenerator };
