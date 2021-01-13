import { CaptainHook } from '@captain-hook/core';
import { CapnEventsEngine } from '@captain-hook/events-engine';
import { UserModel } from 'api/schema/user/model';

import { CombaseRoutingPlugin } from './plugins';
import { CombaseEmailPlugin } from './plugins/email';
import { CombaseActivityPlugin } from './plugins/events';
import { combaseWebhookParser } from './transformers';
import { createDynamicPlugins } from './createDynamicPlugins';

import createChangeStreamSource from './changeStreams';
import { TicketModel } from 'api/schema/ticket/model';

// TODO @luke "source" plugins for captain
/** Source plugin is a plugin that only publishes and listens to another source (i.e. change streams, not capn itself) this allows other events to be piped through capn, similar to onWebhook but for SDK or `stream` based payloads */
const capn = new CaptainHook({
	engine: CapnEventsEngine, // TODO replace with Rabbit Engine
	plugins: [CombaseRoutingPlugin, CombaseActivityPlugin, CombaseEmailPlugin, ...createDynamicPlugins()],
	pre: [combaseWebhookParser],
});

const changeStreamConfig = [[], { fullDocument: 'updateLookup' }];

export const asyncChangeStream = createChangeStreamSource(capn, [
	UserModel.watch(...changeStreamConfig),
	TicketModel.watch(...changeStreamConfig),
]);

export default capn;
