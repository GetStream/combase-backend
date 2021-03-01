import { AgentTC } from 'api/schema/agent/model';
import { OrganizationTC } from './model';

// Removes these two fields entirely from GQL - they must be accessed by hitting mongo directly.
OrganizationTC.removeField('stream.appId');
OrganizationTC.removeField('stream.secret');

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

OrganizationTC.addRelation('availableAgents', {
	prepareArgs: {
		filter: ({ _id }) => ({
			organization: _id.toString(),
		}),
	},
	projection: { _id: true },
	resolver: () => AgentTC.mongooseResolvers.findManyAvailable(),
});
