import { enrichWithAuthToken } from 'utils/resolverMiddlewares/auth';
import { addMeiliDocument, updateMeiliDocument } from 'utils/resolverMiddlewares/search';
import { syncChatProfile } from 'utils/resolverMiddlewares/streamChat';
import { UserModel } from '../model';

const searchableFields = ['_id', 'organization', 'name', 'email'];

export const getOrCreate = tc =>
	tc.schemaComposer
		.createResolver({
			name: 'getOrCreate',
			description: 'Creates a new user, or returns existing user if the orgId & email match',
			type: 'CreateOneUserPayload',
			args: { record: tc.getInputTypeComposer().makeFieldNullable('organization') },
			resolve: async ({ args: { record }, context: { stream, timezone, ...context } }) => {
				const { email, organization } = record;

				const user = await UserModel.findOneAndUpdate(
					{
						email,
						organization,
					},
					{
						$setOnInsert: {
							...record,
							timezone,
						},
					},
					{
						new: true,
						upsert: true,
					}
				);

				const userId = user._id.toString();
				const orgId = organization?.toString?.() || context.organization.toString();

				await stream.chat.upsertUser({
					id: userId,
					name: user._doc.name,
					email: user._doc.email,
					organization: orgId,
					role: 'user',
					timezone: user._doc.timezone,
					entity: tc.getTypeName(),
				});

				return {
					record: user,
				};
			},
		})
		.withMiddlewares([enrichWithAuthToken('user'), addMeiliDocument('user', searchableFields)])
		.clone({ name: 'getOrCreate' });

export const userCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.withMiddlewares([addMeiliDocument('user', searchableFields)])
		.clone({ name: 'create' });
export const userUpdate = tc =>
	tc.mongooseResolvers
		.updateById()
		.withMiddlewares([syncChatProfile('User'), updateMeiliDocument('user', searchableFields)])
		.clone({ name: 'update' });

//TODO: ? deactivate/remove user resolver.
