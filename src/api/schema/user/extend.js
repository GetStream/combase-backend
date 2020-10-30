import { UserTC } from './model';

UserTC.addFields({
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { stream: { chat } }) => chat?.createToken(_id.toString()),
	},
	timeline: {
		type: 'StreamFeed',
		args: {},
		resolve: ({ _id }, _, { stream: { feeds } }) => feeds.feed('user', _id).get(),
	},
});
