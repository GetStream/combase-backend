import { delegateToSchema } from 'apollo-server-express';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';

import { OrganizationTC } from './model';

OrganizationTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) =>
			delegateToSchema({
				args: { id: `organization:${source._id}` },
				context,
				fieldName: 'flatFeed',
				info,
				operation: 'query',
				schema: streamFeeds,
			}),
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
