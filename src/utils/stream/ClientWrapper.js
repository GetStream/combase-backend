import 'dotenv/config';
import { stream as StreamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

class ClientWrapper {
	constructor() {
		this.appKey = process.env.STREAM_APP_KEY;
		this.appSecret = process.env.STREAM_APP_SECRET;
	}

	chat = () => new StreamChatClient(this.appKey, this.appSecret);

	feeds = () => StreamFeedsClient.connect(this.appKey, this.appSecret);

	init() {
		return {
			chat: this.chat(),
			feeds: this.feeds(),
		};
	}
}

export { ClientWrapper };
