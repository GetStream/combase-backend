import { enrichWithAuthToken } from 'utils/resolverMiddlewares/auth';

import { UserTC } from '../model';

export const getOrCreate = () =>
	UserTC.schemaComposer
		.createResolver({
			name: 'getOrCreateUser',
			description: 'Creates a new user, or returns existing user if the orgId & email match',
			type: UserTC,
			args: { record: UserTC.getInputTypeComposer().makeFieldNullable('organization') },
			resolve: async ({
				args: { record },
				context: {
					models: { User },
					stream,
				},
			}) => {
				const { email, organization } = record;

				const user = await User.findOneAndUpdate(
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
					entity: 'User',
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
		.withMiddlewares([enrichWithAuthToken('user')]);
