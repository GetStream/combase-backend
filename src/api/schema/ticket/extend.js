import schemaComposer from 'api/schema/composer';

import { TicketTC } from './model';

TicketTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) => schemaComposer.Query.getResolver('flatFeed').resolve(source, args, context, info),
	},
	/*
	 * IDEA/TODO - For @graphql-stream/chat, we can add a realtion field to the ticket
	 * for a channel and have everything come from one query...
	 */
});
