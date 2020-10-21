import jwt from 'jsonwebtoken';
import { getTokenPayload } from 'utils/auth';

export const loginAgent = async (_, { email, password }, { models: { Agent } }) => {
	if (!email || !password) {
		throw new Error('Missing arguments.');
	}

	const agent = await Agent.findOne({ email });

	if (!agent) {
		throw new Error('Account does not exist.');
	}

	const validate = await agent.verifyPassword(password);

	if (!validate) {
		throw new Error('Incorrect password.');
	}

	const token = jwt.sign(getTokenPayload(agent), process.env.AUTH_SECRET);

	delete agent._doc.password;

	return {
		...agent._doc,
		token,
	};
};
