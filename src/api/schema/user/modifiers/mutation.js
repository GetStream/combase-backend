import { enrichWithAuthToken } from 'utils/resolverMiddlewares/auth';
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

				// Organization feed follows the user.
				await stream.feeds.feed('organization', orgId).follow('user', userId);

				/*
				 * TODO: This should be handled by the mongo change stream events
				 * await stream.feeds.feed('user', userId).addActivity({
				 * 	actor: userId,
				 * 	object: userId,
				 * 	entity: 'User',
				 * 	text: 'User Created',
				 * 	verb: 'combase:user.created',
				 * });
				 */

				return {
					record: user,
				};
			},
		})
		.withMiddlewares([enrichWithAuthToken('user')])
		.clone({ name: 'getOrCreate' });

export const userCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const userUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });

//TODO: ? deactivate/remove user resolver.
