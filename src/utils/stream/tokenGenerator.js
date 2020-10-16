import 'dotenv/config';

import { clientWrapper } from './clientWrapper';

const tokenGenerator = uid => {
	const client = clientWrapper();

	const tokens = {
		chat: client.chat.createToken(uid),
		feeds: client.feeds.createUserToken(uid),
	};

	return tokens;
};

export { tokenGenerator };
