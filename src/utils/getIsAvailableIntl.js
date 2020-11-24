import { DateTime } from 'luxon';

/**
 * Creates localized versions of the given start & end time, then compares with a Date object 'now' to determine
 * if the agent is available or not.
 * @param {Object} schedule - The agents schedule for today { start: Number, end: Number }
 * @param {String} timezone - The timezone of the agent from which to convert the time from.
 */
export const getIsAvailableIntl = (schedule, timezone) => {
	/**
	 * Create start and end values with the correct timezone
	 * Then call toJSDate to return a JS Date Object
	 * ! The Date object is returned in the local timezone.
	 * ! This means if schedule.start.hour is 9 (9am) and the timezone is "America/Denver", the result of .toJSDate() will be 17 (5pm) CEST
	 * ! This allows us to compare the dates with simple JS Operators "<" ">" etc.
	 */
	const start = DateTime.fromObject({
		hour: schedule.start.hour,
		minute: schedule.start.minute,
		second: 0,
		zone: timezone,
	}).toJSDate();

	const end = DateTime.fromObject({
		hour: schedule.end.hour,
		minute: schedule.end.minute,
		second: 0,
		zone: timezone,
	}).toJSDate();

	/**
	 * Current Local Time
	 */
	const now = DateTime.local();

	const available = now > start && now < end;

	return available;
};
