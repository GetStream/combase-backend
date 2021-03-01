import 'dotenv/config';

export const extend = tc => {
	tc.getITC('FilterFindManyAgentInput').addFields({
		available: 'Boolean',
	});

	tc.addFields({
		token: 'String',
	});
};
