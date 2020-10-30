import { SchemaComposer } from 'graphql-compose';

import Chat from './chat';
import Feeds from './feeds';

const schemaComposer = new SchemaComposer();

schemaComposer.merge(Feeds);
schemaComposer.merge(Chat);

export const schema = schemaComposer.buildSchema();
