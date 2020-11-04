import { UserTC } from '../model';

export const getOrCreateUser = {
	name: 'getOrCreateUser',
	description: 'Creates a new user, or returns existing user if the orgId & email match',
	type: UserTC,
	args: { record: 'CreateOneUserInput!' },
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

			await stream.chat.setUser({
				id: user._id.toString(),
				name: user._doc.name,
				email: user._doc.email,
				status: 'unassigned',
			});
		}

		return user._doc;
	},
};
