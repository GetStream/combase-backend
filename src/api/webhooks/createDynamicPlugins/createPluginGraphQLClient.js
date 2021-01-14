import { GraphQLClient } from 'graphql-request';

export const createPluginGraphQLClient = () => new GraphQLClient('https://combase-api.ngrok.io/graphql');
