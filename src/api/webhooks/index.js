import { CaptainHook } from '@captain-hook/core';
import { CapnEventsEngine } from '@captain-hook/events-engine';
import { UserModel } from 'api/schema/user/model';

import { CaptainChangeStreams } from './changeStreams';
import { CombaseRoutingPlugin } from './plugins';
import { CombaseEmailPlugin } from './plugins/email';
import { CombaseTestChangeStream } from './plugins/changeStreamTest';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';

const capn = new CaptainHook({
	engine: CapnEventsEngine,
	plugins: [CombaseRoutingPlugin, CombaseActivityPlugin, CombaseEmailPlugin, CombaseTestChangeStream],
	pre: [combaseWebhookParser],
});

export const asyncChangeStream = new CaptainChangeStreams(capn, UserModel);

export default capn;
