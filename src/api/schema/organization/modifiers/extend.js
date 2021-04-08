import jwt from 'jsonwebtoken';
import { createPermissionAwareRelationship } from 'utils/permissionAwareConnection';
import { OrganizationModel } from 'api/schema/organization/model';

export const OrganizationSecrets = tc => {
	tc.schemaComposer.getOTC('OrganizationSecrets').addFields({
		token: {
			type: 'String!',
			projection: {
				_id: true,
				value: true,
				scope: true,
			},
			resolve: ({ value, _id }, _, { organization }) =>
				jwt.sign(
					{
						organization,
						_id,
					},
					value
				),
		},
		verify: {
			type: 'Boolean!',
			args: {
				token: 'String!',
			},
			projection: {
				value: true,
			},
			kind: 'query',
			resolve: async (source, args) => {
				try {
					await jwt.verify(args?.token, source.value);

					return true;
				} catch (error) {
					return false;
				}
			},
		},
	});
};

export const extend = tc => {
	tc.removeField('stream.secret');

	tc.addFields({
		secret: {
			type: 'OrganizationSecrets',
			args: { _id: 'MongoID!' },
			projection: { secrets: true },
			resolve: (source, args) => source?.secrets?.find(({ _id }) => args._id === _id.toString()),
		},
	});

	tc.addNestedFields({
		'stream.key': {
			type: 'String!',
			args: {},
			resolve: async (source, _, { organization }) => {
				if (!organization) {
					throw new Error('Unauthorized');
				}

				try {
					const { stream } = await OrganizationModel.findById(organization, { 'stream.key': true });

					if (source.key === stream?.key) {
						const decrypted = await OrganizationModel.findOne({ _id: organization }, { stream: true });

						return decrypted?.stream?.key;
					}

					return null;
				} catch (error) {
					throw new Error(error.message);
				}
			},
		},
	});

	tc.addRelation('availableAgents', {
		prepareArgs: {
			filter: ({ _id }) => ({
				organization: _id.toString(),
			}),
		},
		projection: { _id: true },
		resolver: () => tc.schemaComposer.getOTC('Agent').getResolver('getAvailable'),
	});
};

export const relateAgents = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Agent'), { search: true });
export const relateAsset = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Asset'));

export const relateFaqs = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Faq'));

export const relateGroup = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Group'));
export const relateIntegration = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Integration'));
export const relateTag = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Tag'));
export const relateTicket = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Ticket'));
export const relateUser = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('User'));
// export const relateWebhook = tc => createPermissionAwareRelationship(tc, tc.schemaComposer.getOTC('Webhook')); TODO
