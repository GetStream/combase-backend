import { CaptainHook } from '@captain-hook/core';
import { CapnEventsEngine } from '@captain-hook/events-engine';

import { UserModel } from 'api/schema/user/model';
import { TicketModel } from 'api/schema/ticket/model';

import { combaseWebhookParser } from './transformers';
import { createDynamicPlugins } from './pluginCreator';

import createChangeStreamSource from './createChangeStreamSource';

const changeStreamConfig = [[], { fullDocument: 'updateLookup' }];
/*
 * const ChangeStreamSource = createChangeStreamSource([UserModel.watch(...changeStreamConfig), TicketModel.watch(...changeStreamConfig)]);
 * TODO @luke "source" plugins for captain
 */
/** Source plugin is a plugin that only publishes and listens to another source (i.e. change streams, not capn itself) this allows other events to be piped through capn, similar to onWebhook but for SDK or `stream` based payloads */
const capn = new CaptainHook({
	engine: CapnEventsEngine, // TODO replace with Rabbit Engine
	plugins: createDynamicPlugins(),
	pre: [combaseWebhookParser],
	// source: [ChangeStreamSource],
});

createChangeStreamSource(capn, [UserModel.watch(...changeStreamConfig), TicketModel.watch(...changeStreamConfig)]);

export default capn;
