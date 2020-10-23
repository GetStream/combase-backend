import { connect as streamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

export const clientWrapper = (appKey, appSecret) => {
	return {
		chat: new StreamChatClient(appKey, appSecret),
		feeds: streamFeedsClient(appKey, appSecret),
	};
};
