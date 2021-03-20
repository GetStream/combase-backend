import { OrganizationModel } from 'api/schema/organization/model';
import { createMockDataResolver } from './createMockDataResolver';

const chatCommands = [
	{
		args: '',
		description: 'Mark this ticket as closed or open.',
		name: 'mark',
		set: 'combase_set',
	},
	{
		args: '[level{0,1,2}]',
		description: 'Set the priority level of this ticket.',
		name: 'priority',
		set: 'combase_set',
	},
	{
		args: '',
		description: 'Star this ticket.',
		name: 'star',
		set: 'combase_set',
	},
	{
		args: '[tag name]',
		description: 'Add a tag to this ticket.',
		name: 'tag',
		set: 'combase_set',
	},
	{
		args: '',
		description: 'Transfer this ticket to another agent.',
		name: 'transfer',
		set: 'combase_set',
	},
];

export const organizationCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
			/**
			 * Here we create a stream chat user for the Organization, so it can be added
			 * to chats for system messages, unassigned handling & eventually "bot" messages.
			 */
			try {
				const { stream } = rp.context;

				if (!stream?.chat) {
					throw new Error('No stream client in context. Something went wrong');
				}

				// eslint-disable-next-line callback-return
				const data = await next(rp);

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

				// Create stream chat customizations for the new organization
				await Promise.all([
					...chatCommands.map(cmd => stream.chat.createCommand(cmd)),
					stream.chat.updateAppSettings({
						webhook_url: `${process.env.INGRESS_URL}/webhook`,
						custom_action_handler_url: `${process.env.INGRESS_URL}/chat-commands?type={type}`,
					}),
				]);

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
