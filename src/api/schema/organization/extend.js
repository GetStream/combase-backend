import getDay from 'date-fns/getDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { utcToZonedTime } from 'date-fns-tz';

import { OrganizationTC } from './model';

OrganizationTC.addFields({
	available: {
		type: 'Boolean',
		args: {},
		resolve: async ({ _id }, _, { models: { Organization } }) => {
			const { hours, timezone } = await Organization.findById(_id, { hours: 1 });

			if (!hours?.length) {
				// If no hours are set at all for this org, then the org is always available.
				return true;
			}

			/** UTC Date for the user. */
			const now = new Date();

			const todayNo = getDay(now);

			// If hours are set for the org, but the current day is either disabled or non-existent, return as unavailable.
			const today = hours.find(({ day }) => day === todayNo);

			if (!today?.enabled) {
				return false;
			}

			const zonedStart = utcToZonedTime(new Date().setUTCHours(today.start.hour, today.start.minute, 0, 0), timezone);
			const zonedEnd = utcToZonedTime(new Date().setUTCHours(today.end.hour, today.end.minute, 0, 0), timezone);

			return isAfter(now, zonedStart) && isBefore(now, zonedEnd);
		},
	},
	timeline: {
		type: 'StreamFeed',
		args: {},
		resolve: ({ _id }, _, { stream }) => stream.feeds.feed('organization', _id).get(),
	},
});

OrganizationTC.addNestedFields({
	'stream.key': {
		type: 'String!',
		args: {},
		resolve: async (source, _, { models: { Organization }, organization }) => {
			if (!organization) {
				throw new Error('Unauthorized');
			}

			try {
				const { stream } = await Organization.findById(organization, { 'stream.key': true });

				if (source.key === stream?.key) {
					const decrypted = await Organization.findOne({ _id: organization }, { stream: true });

					return decrypted?.stream?.key;
				}

				return null;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	},
});

OrganizationTC.makeFieldNullable('stream.key');

OrganizationTC.removeField('stream.secret');
