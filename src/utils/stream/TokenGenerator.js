import 'dotenv/config';

import { ClientWrapper } from './ClientWrapper';

class TokenGenerator {
	constructor(uid) {
		this.uid = uid.toString();

		this.clients = new ClientWrapper().init;
	}

	chat = () => this.clients.chat.createToken(this.uid);

	feeds = () => this.clients.feeds.createUserToken(this.uid);

	init() {
		return {
			chat: this.chat(),
			feeds: this.feeds(),
		};
	}
}

export { TokenGenerator };
