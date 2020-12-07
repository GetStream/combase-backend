import { CaptainHook } from '@captain-hook/core';

import { CombaseRoutingPlugin } from './plugins';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';

const capn = new CaptainHook(
	process.env.AUTH_SECRET,
	[new CombaseRoutingPlugin(), new CombaseActivityPlugin(['member.added', 'channel.created'])],
	[combaseWebhookParser]
);

export default capn;
