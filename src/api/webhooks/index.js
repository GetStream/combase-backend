import { CaptainHook } from '@captain-hook/core';
import { CapnEventsEngine } from '@captain-hook/events-engine';

import { CombaseRoutingPlugin } from './plugins';
import { CombaseEmailPlugin } from './plugins/email';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';

const capn = new CaptainHook({
	engine: CapnEventsEngine,
	plugins: [CombaseRoutingPlugin, CombaseActivityPlugin, CombaseEmailPlugin],
	pre: [combaseWebhookParser],
});

export default capn;
