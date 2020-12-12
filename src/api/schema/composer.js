import { SchemaComposer } from 'graphql-compose';
import { schema as feedsSchema } from '@stream-io/graphql-feeds';

export default new SchemaComposer(feedsSchema);
