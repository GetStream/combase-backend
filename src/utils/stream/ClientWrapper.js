import 'dotenv/config';
import { stream as StreamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

class ClientWrapper {
	constructor() {
		this.appKey = process.env.STREAM_APP_KEY;
		this.appSecret = process.env.STREAM_APP_SECRET;
	}

	chat() {
		const client = new StreamChatClient(this.appKey, this.appSecret);

		return client;
	}

	feeds() {
		const client = StreamFeedsClient.connect(this.appKey, this.appSecret);

		return client;
	}

	init() {
		return {
			chat: this.chat(),
			feeds: this.feeds(),
		};
	}
}

export { ClientWrapper };
