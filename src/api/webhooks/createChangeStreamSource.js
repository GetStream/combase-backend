/**
 * ChangeStreams are a little different to usual capn plugins
 * We can asynchronously loop over them without capn, therefore we can listen to change stream, but still publish events to capn.
 */
import { CaptainChangeStreams } from '@captain-hook/source-changestreams';

import triggerManifest from '../../../events.manifest';

const allTriggerNames = Object.entries(triggerManifest).flatMap(([parent, operations]) =>
	operations.map(operation => `${parent}:${operation}`)
);

const validateTrigger = trigger => allTriggerNames.includes(trigger);

export default (capn, models) =>
	new CaptainChangeStreams(capn, models, {
		validateTrigger,
	});
