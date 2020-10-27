import { connect as streamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

const stream = (appKey, appSecret) => {
	if (!appKey || !appSecret) return {};

	return {
		chat: new StreamChatClient(appKey, appSecret),
		feeds: streamFeedsClient(appKey, appSecret),
	};
};

export { stream };
