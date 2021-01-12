import { CaptainHook } from '@captain-hook/core';
import { CapnEventsEngine } from '@captain-hook/events-engine';
import { UserModel } from 'api/schema/user/model';

import { CaptainChangeStreams } from './changeStreams';
import { CombaseRoutingPlugin } from './plugins';
import { CombaseEmailPlugin } from './plugins/email';
import { CombaseTestChangeStream } from './plugins/changeStreamTest';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';
import { createDynamicPlugins } from './createDynamicPlugins';

// TODO @luke create a plugin that uses the new change stream event names to test generating plugins dynamically for the installed plugins

// TODO @luke "source" plugins for captain
/** Source plugin is a plugin that only publishes and listens to another source (i.e. change streams, not capn itself) this allows other events to be piped through capn, similar to onWebhook but for SDK or `stream` based payloads */
const capn = new CaptainHook({
	engine: CapnEventsEngine, // TODO @nick replace with Rabbit Engine
	plugins: [CombaseRoutingPlugin, CombaseActivityPlugin, CombaseEmailPlugin, CombaseTestChangeStream],
	pre: [combaseWebhookParser],
});

createDynamicPlugins();

export const asyncChangeStream = new CaptainChangeStreams(capn, UserModel);

export default capn;
