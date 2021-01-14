import { OrganizationTC } from './model';

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

OrganizationTC.removeField('stream');
