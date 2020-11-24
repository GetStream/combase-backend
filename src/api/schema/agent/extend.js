import getDay from 'date-fns/getDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { utcToZonedTime } from 'date-fns-tz';

import { AgentTC } from './model';

AgentTC.addFields({
	available: {
		type: 'Boolean',
		args: {},
		resolve: async ({ _id }, _, { models: { Agent } }) => {
			const { hours, timezone } = await Agent.findById(_id, { hours: 1 });

			if (!hours?.length) {
				// If no hours are set at all for this agent, then the agent is always available.
				return true;
			}

			/** UTC Date for the user. */
			const now = new Date();

			const todayNo = getDay(now);

			// If hours are set for the agent, but the current day is either disabled or non-existent, return as unavailable.
			const today = hours.find(({ day }) => day === todayNo);

			if (!today?.enabled) {
				return false;
			}

			/*
			 * Take the generate start and end values and create a new Date object for each
			 * This ensures the day/month/year matches the users comparison date regardless of locale
			 * Then we can use utcToZonedTime and pass the organizations timezone so that it is returned as the correct time in the users timezone.
			 */
			const zonedStart = utcToZonedTime(new Date().setUTCHours(today.start.hour, today.start.minute, 0, 0), timezone);
			const zonedEnd = utcToZonedTime(new Date().setUTCHours(today.end.hour, today.end.minute, 0, 0), timezone);

			return isAfter(now, zonedStart) && isBefore(now, zonedEnd);
		},
	},
	timeline: {
		type: 'StreamFeed',
		args: {},
		resolve: ({ _id }, _, { stream }) => stream.feeds.feed('agent', _id).get(),
	},
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { agent, stream: { chat } }) => (agent.toString() === _id.toString() ? chat?.createToken(_id.toString()) : null),
	},
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

AgentTC.removeField('password');
