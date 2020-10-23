import 'dotenv/config';

export const getStreamCredentials = () => {
	let appKey;
	let appSecret;
	let credentials = false;

	if (process.env.STREAM_URL) {
		[appKey, appSecret] = process.env.STREAM_URL.substr(8).split('@')[0].split(':');

		credentials = {
			appKey,
			appSecret,
		};
	}

	return credentials;
};
