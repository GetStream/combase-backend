import { connect as streamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

import { FeedsSubscriber } from '../subscriptions';

export const streamCtx = (appKey, appSecret, appId) => {
	if (!appKey || !appSecret || !appId) return {};

	return {
		chat: new StreamChatClient(appKey, appSecret),
		feeds: streamFeedsClient(appKey, appSecret, appId),
		subscriptions: {
			feeds: new FeedsSubscriber(appKey, appSecret, appId),
		},
	};
};
