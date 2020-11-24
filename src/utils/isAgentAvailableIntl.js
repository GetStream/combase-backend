import { DateTime } from 'luxon';

/**
 * Creates localized versions of the given start & end time, then compares with a Date object 'now' to determine
 * if the agent is available or not.
 */
export const isAgentAvailableIntl = ({ hours, timezone }) => {
	let todayNo = new Date().getDay();

	if (todayNo === 0) todayNo = 7;

	const today = hours?.find?.(({ day }) => day === todayNo);

	if (!today?.enabled) {
		return false;
	}

	/**
	 * Create start and end values with the correct timezone
	 * Then call toJSDate to return a JS Date Object
	 * ! The Date object is returned in the local timezone.
	 * ! This means if schedule.start.hour is 9 (9am) and the timezone is "America/Denver", the result of .toJSDate() will be 17 (5pm) CEST
	 * ! This allows us to compare the dates with simple JS Operators "<" ">" etc.
	 */
	const start = DateTime.fromObject({
		hour: today.start.hour,
		minute: today.start.minute,
		second: 0,
		zone: timezone,
	}).toJSDate();

	const end = DateTime.fromObject({
		hour: today.end.hour,
		minute: today.end.minute,
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
