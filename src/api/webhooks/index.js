import { CaptainHook } from '@captain-hook/core';

import { CombaseRoutingPlugin } from './plugins';
import { CombaseEmailPlugin } from './plugins/email';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';

const capn = new CaptainHook(
	process.env.AUTH_SECRET,
	[new CombaseRoutingPlugin(), new CombaseActivityPlugin(), new CombaseEmailPlugin()],
	[combaseWebhookParser]
);

export default capn;
