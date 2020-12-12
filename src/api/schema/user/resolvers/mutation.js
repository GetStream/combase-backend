import { UserTC } from '../model';

export const getOrCreateUser = {
	name: 'getOrCreateUser',
	description: 'Creates a new user, or returns existing user if the orgId & email match',
	type: UserTC,
	args: { record: UserTC.getInputTypeComposer().makeFieldNullable('organization') },
	resolve: async (_, { record }, { models: { User }, organization, stream }) => {
		if (!organization) {
			throw new Error('Unauthorized.');
		}

		let user = await User.findOne({
			email: record.email,
			organization,
		});

		if (!user) {
			user = await User.create({
				...record,
				organization,
			});

			const userId = user._id.toString();

			await stream.chat.setUser({
				id: userId,
				name: user._doc.name,
				email: user._doc.email,
				organization: organization.toString(),
				entity: 'User',
			});

			// Organization feed follows the user.
			await stream.feeds.feed('organization', organization.toString()).follow('user', userId);

			// TODO: This should be handled by the mongo change stream events plugin for captain-hook instead.
			await stream.feeds.feed('user', userId).addActivity({
				actor: userId,
				object: userId,
				entity: 'User',
				text: 'User Created',
				verb: 'combase:user.created',
			});
		}

		return user._doc;
	},
};
