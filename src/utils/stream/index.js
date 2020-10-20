import { clientWrapper } from './clientWrapper';

export const getStreamContext = (appKey, appSecret) => {
	const { chat, feeds } = clientWrapper(appKey, appSecret);

	return {
		chat,
		feeds,
	};
};
