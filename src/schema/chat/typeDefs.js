export const typeDefs = `
	type Mutation {
		createChat(organization: MongoID!, user: MongoID!): Chat!
	}
`;
