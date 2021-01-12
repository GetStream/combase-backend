// Did as a JS file so I can push comments. Can probably use a plain JSON file, or store as additional data on each Model instance.

/*
 * Each event type is the key
 * Every event name is stored as members of the array.
 * Triggers are composed of colon-separated types and names i.e.
 * `agent:deleted` `ticket:created`
 *
 * We can then use change streams to create these events using captain-hook.
 * Each Combase Integration that is installed will export a method that will be used by
 * captain-hook to subscribe to certain events.
 */

export default {
	agent: ['created', 'deleted', 'updated'],
	asset: ['created', 'deleted', 'updated'],
	faq: ['created', 'deleted', 'updated'],
	group: ['created', 'deleted', 'updated'],
	integration: ['created', 'deleted', 'updated'],
	note: ['created', 'deleted', 'updated'],
	organization: ['created', 'deleted', 'updated'],
	tag: ['created', 'deleted', 'updated'],
	ticket: ['created', 'deleted', 'updated'],
	user: ['created', 'deleted', 'updated'],
	webhook: ['created', 'deleted', 'updated'],
};
