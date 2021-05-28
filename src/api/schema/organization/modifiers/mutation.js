import { AnyResource, AnyRole, Allow, Deny, Permission } from 'stream-chat';
import { OrganizationModel } from 'api/schema/organization/model';
import { logger } from 'utils/logger';
import { syncOrganizationProfile } from 'utils/resolverMiddlewares/streamChat';
import { createMockDataResolver } from './createMockDataResolver';

const chatCommands = [
	{
		args: '[status{open,closed}]',
		description: 'Mark this ticket as closed or open.',
		name: 'markas',
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

const permissions = [
	new Permission('Admin Agents', 600, AnyResource, ['admin'], false, Allow),
	new Permission('Moderator Agents', 575, AnyResource, ['moderator'], false, Allow),
	new Permission('Guest Agents', 550, AnyResource, ['guest'], true, Allow), // TODO: This rule means we should probably hide the Unassigned inbox when authed as a guest.
	new Permission('Users can modify their own messages', 500, AnyResource, ['user'], true, Allow),
	new Permission('End Users', 400, AnyResource, ['user'], false, Allow),
	new Permission('Anonymous users', 300, AnyResource, ['anonymous'], true, Allow),
	new Permission('Channel Members', 200, ['ReadChannel', 'CreateMessage'], ['channel_member'], false, Allow),
	new Permission('Discard all', 100, AnyResource, AnyRole, false, Deny),
];

const configureCombaseChatOrganization = async (tc, org, stream) => {
	/**
	 * First create a StreamChat user for the Organization for sending system messages, handling unassigned etc.
	 */
	await stream.chat.upsertUser({
		avatar: org.branding.logo,
		email: org.contact.email,
		id: org._id.toString(),
		name: org.name,
		role: 'admin',
		organization: org._id.toString(),
		timezone: '',
		entity: tc.getTypeName(),
	});

	/**
	 * Now create our custom chat commands
	 */
	// eslint-disable-next-line no-unused-vars
	for await (const command of chatCommands) {
		try {
			await stream.chat.createCommand(command);
		} catch (error) {
			logger.warn(error.message);
		}
	}

	/**
	 * Then create our custom channel type for Combase, and apply both the custom commands and permissions from above.
	 */
	await stream.chat.createChannelType({
		name: 'combase',
		commands: ['giphy', ...chatCommands.map(({ name }) => name)],
		permissions,
	});

	/**
	 * Finally, add the ingress URL to the webhook_url and custom_action_handler_url of the chat app.
	 */
	await stream.chat.updateAppSettings({
		webhook_url: `${process.env.INGRESS_URL}/webhook`,
		custom_action_handler_url: `${process.env.INGRESS_URL}/chat-commands?type={type}`,
	});
};

export const organizationCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
			try {
				const { stream } = rp.context;

				if (!stream?.chat) {
					throw new Error('No stream client in context. Something went wrong');
				}

				// eslint-disable-next-line callback-return
				const data = await next(rp);

				const { _doc } = data.record;

				try {
					// Create stream chat customizations for the new organization
					await configureCombaseChatOrganization(tc, _doc, stream);

					return data;
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(error.message);
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error.message);
			}
		})
		.clone({ name: 'create' });
export const organizationUpdate = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncOrganizationProfile]).clone({ name: 'update' });

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
