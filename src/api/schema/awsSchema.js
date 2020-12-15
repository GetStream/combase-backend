import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import awsSDK from 'aws-sdk';
import { AwsApiParser } from 'graphql-compose-aws';

const awsApiParser = new AwsApiParser({
	awsSDK,
});

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			s3: awsApiParser.getService('s3').getFieldConfig(),
		},
	}),
});

export default schema;
