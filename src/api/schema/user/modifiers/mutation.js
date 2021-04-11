import { enrichWithAuthToken } from 'utils/resolverMiddlewares/auth';
import { syncChatProfile } from 'utils/resolverMiddlewares/streamChat';
import { UserModel } from '../model';

export const getOrCreate = tc =>
	tc.schemaComposer
		.createResolver({
			name: 'getOrCreate',
			description: 'Creates a new user, or returns existing user if the orgId & email match',
			type: tc,
			args: { record: tc.getInputTypeComposer().makeFieldNullable('organization') },
			resolve: async ({ args: { record }, context: { stream } }) => {
				const { email, organization } = record;

				const user = await UserModel.findOneAndUpdate(
					{
						email,
						organization,
					},
					{
						$setOnInsert: record,
					},
					{
						new: true,
						upsert: true,
					}
				);

				const userId = user._id.toString();
				const orgId = organization.toString();

				await stream.chat.upsertUser({
					id: userId,
					name: user._doc.name,
					email: user._doc.email,
					organization: orgId,
					entity: tc.getTypeName(),
				});

				return {
					record: user,
				};
			},
		})
		.withMiddlewares([enrichWithAuthToken('user')])
		.clone({ name: 'getOrCreate' });

export const userCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const userUpdate = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChatProfile('User')]).clone({ name: 'update' });

//TODO: ? deactivate/remove user resolver.
