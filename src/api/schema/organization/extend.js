import { OrganizationTC } from './model';

// Removes these two fields entirely from GQL - they must be accessed by hitting mongo directly.
OrganizationTC.removeField('stream.appId');
OrganizationTC.removeField('stream.secret');

OrganizationTC.addNestedFields({
	'stream.key': {
		type: 'String!',
		args: {},
		resolve: async (source, _, { models: { Organization }, organization, agent }) => {
			if (!organization || !agent) {
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
