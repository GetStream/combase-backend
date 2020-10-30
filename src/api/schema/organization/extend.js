import { OrganizationTC } from './model';

OrganizationTC.addFields({
	timeline: {
		type: 'StreamFeed',
		args: {},
		resolve: ({ _id }, _, { stream }) => stream.feeds.feed('organization', _id).get(),
	},
});

OrganizationTC.removeField('stream.secret');
