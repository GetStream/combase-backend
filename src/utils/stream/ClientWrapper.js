import { stream as StreamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

export const clientWrapper = (appKey, appSecret) => {
	return {
		chat: new StreamChatClient(appKey, appSecret),
		feeds: StreamFeedsClient.connect(appKey, appSecret),
	};
};
