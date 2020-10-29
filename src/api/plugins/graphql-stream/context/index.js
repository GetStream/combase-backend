import { connect as streamFeedsClient } from 'getstream';
import { StreamChat as StreamChatClient } from 'stream-chat';

import { ChatSubscription, FeedsSubscription } from '../subscriptions';

export const streamCtx = (appKey, appSecret, appId) => {
	if (!appKey || !appSecret || !appId) return {};

	const chat = new StreamChatClient(appKey, appSecret);
	const feeds = streamFeedsClient(appKey, appSecret, appId);

	return {
		chat,
		feeds,
		ChatSubscription,
		FeedsSubscription,
	};
};
