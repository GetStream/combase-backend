import { schemaComposer } from 'graphql-compose';

schemaComposer.createObjectTC(`
	type Activity {
		actor: String!
		verb: String!
		object: String!
		time: String
		to: [String!] 
		foreign_id: String
	}
`);

const Query = {};

export default {
	Query,
};
