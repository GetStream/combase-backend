import { SchemaComposer } from 'graphql-compose';
import { schema as feedsSchema } from '@stream-io/graphql-feeds';

const schemaComposer = new SchemaComposer(feedsSchema);

export default schemaComposer;
