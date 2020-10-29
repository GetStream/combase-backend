import { SchemaComposer } from 'graphql-compose';

import Activity from './activity';
import { FlatFeed } from './feeds';

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
	...FlatFeed.Query,
	...Activity.Query,
});

schemaComposer.Subscription.addFields({
	...FlatFeed.Subscription,
});

export const schema = schemaComposer.buildSchema();
