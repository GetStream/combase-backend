import schemaComposer from 'api/schema/composer';

import { UserTC } from './model';

UserTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) => schemaComposer.Query.getResolver('flatFeed').resolve(source, args, context, info),
	},
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { stream: { chat } }) => chat?.createToken(_id.toString()),
	},
});
