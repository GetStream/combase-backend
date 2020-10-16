import 'dotenv/config';
import { stream as StreamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

const clientWrapper = (appKey = process.env.STREAM_APP_KEY, appSecret = process.env.STREAM_APP_SECRET) => {
	const client = {
		chat: new StreamChatClient(appKey, appSecret),
		feeds: StreamFeedsClient.connect(appKey, appSecret),
	};

	return client;
};

export { clientWrapper };
