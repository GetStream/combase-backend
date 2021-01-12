/**
 * ChangeStreams are a little different to usual capn plugins
 * We can asynchronously loop over them without capn, therefore we can listen to change stream, but still publish events to capn.
 */
import { logger } from 'utils/logger';
import { ChangeStreamIterator } from 'changestream-iterator';

import triggerManifest from '../../../events.manifest';

const allTriggerNames = Object.entries(triggerManifest).flatMap(([parent, operations]) =>
	operations.map(operation => `${parent}:${operation}`)
);

const generateTrigger = (triggerParent, operationType) => {
	let triggerOperation;

	switch (operationType) {
		case 'create': {
			triggerOperation = 'created';

			break;
		}

		case 'update': {
			triggerOperation = 'updated';

			break;
		}

		case 'delete': {
			triggerOperation = 'deleted';

			break;
		}

		default:
			return;
	}

	return [triggerParent, triggerOperation].join(':');
};

const validateTrigger = trigger => allTriggerNames.includes(trigger);

export class CaptainChangeStreams {
	constructor(capn, model) {
		this.capn = capn;

		this.listen(model);
	}

	changeStreamToEvent = ({ _id: _, clusterTime: __, operationType, ns: { coll: collectionName }, documentKey: { _id }, ...rest }) => {
		const triggerParent = collectionName.endsWith('s') ? collectionName.slice(0, collectionName.length - 1) : collectionName;
		const trigger = generateTrigger(triggerParent, operationType);

		if (!trigger) {
			logger.error(`Couldn't discern the correct event trigger from the ${operationType} event on the ${collectionName} collection.`);

			return;
		}

		if (trigger && !validateTrigger(trigger)) {
			logger.error(`Generated trigger ${trigger} was not recognized as a valid Combase event trigger`);
		}

		return [
			trigger,
			{
				_id,
				data: rest,
			},
		];
	};

	publish = (...args) => this.capn.publish(...args);

	listen = async model => {
		const events = new ChangeStreamIterator(model);

		try {
			// eslint-disable-next-line multiline-comment-style
			for await (const event of events) {
				const payload = this.changeStreamToEvent(event);

				this.publish(...payload);
			}
		} catch (error) {
			logger.error(error);
		}
	};
}
