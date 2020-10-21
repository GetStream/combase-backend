import { clientWrapper } from './clientWrapper';

export const getStreamContext = (appKey, appSecret) => {
	if (!appKey || !appSecret) return {};

	const { chat, feeds } = clientWrapper(appKey, appSecret);

	return {
		chat,
		feeds,
	};
};
