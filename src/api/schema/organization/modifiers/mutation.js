import { OrganizationModel } from 'api/schema/organization/model';
import { createMockDataResolver } from './createMockDataResolver';

export const organizationCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
			/**
			 * Here we create a stream chat user for the Organization, so it can be added
			 * to chats for system messages, unassigned handling & eventually "bot" messages.
			 */
			try {
				// eslint-disable-next-line callback-return
				const data = await next(rp);

				const { stream } = rp.context;
				const { _doc } = data.record;

				await stream.chat.upsertUser({
					avatar: _doc.branding.logo,
					email: _doc.contact.email,
					id: _doc._id.toString(),
					name: _doc.name,
					organization: _doc._id.toString(),
					timezone: '',
					entity: tc.getTypeName(),
				});

				return data;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error.message);
			}
		})
		.clone({ name: 'create' });
export const organizationUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });

// TODO: destroy org resolver
export const organizationCreateApiCredentials = tc =>
	tc.schemaComposer.createResolver({
		name: 'createApiCredentials',
		type: tc,
		kind: 'mutation',
		args: {
			name: 'String!',
			scope: 'EnumOrganizationSecretsScope',
		},
		resolve: ({ args, context }) => {
			if (!context?.organization) {
				throw new Error('Unauthorized');
			}

			return OrganizationModel.findByIdAndUpdate(context?.organization, { $addToSet: { secrets: args } }, { new: true });
		},
	});

export const generateMockData = createMockDataResolver;
