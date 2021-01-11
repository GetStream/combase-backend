import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

import schemaComposer from 'api/schema/composer';

const IntegrationredentialsSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		description: 'Name of the stored credential.',
	},
	value: {
		type: String,
		trim: true,
		required: true,
		description: 'Value of the stored credential.',
	},
});

IntegrationredentialsSchema.plugin(fieldEncryption, {
	fields: ['value'],
	secret: process.env.AUTH_SECRET,
});

const IntegrationSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization the Integration is associated with.',
		},
		credentials: IntegrationredentialsSchema,
		enabled: {
			type: Boolean,
			default: false,
			description: 'Boolean representation of the integration status.',
		},
	},
	{ collection: 'integrations' }
);

IntegrationSchema.plugin(timestamps);

IntegrationSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const IntegrationModel = mongoose.model('Integration', IntegrationSchema);
export const IntegrationTC = composeMongoose(IntegrationModel, { schemaComposer });

/**
 * Types for Integration Definitions
 */
export const IntegrationDefinitionFilterITC = schemaComposer.createInputTC({
	name: 'IntegrationDefinitionFilterInput',
	fields: {
		id: 'String',
		name: 'String',
	},
});

export const IntegrationDefinitionTC = schemaComposer.createObjectTC({
	name: 'IntegrationDefinition',
	fields: {
		configuration: 'JSON!',
		id: 'String!',
		fields: 'JSON!',
		name: 'String!',
		triggers: 'JSON!',
		internal: {
			type: schemaComposer.createObjectTC({
				name: 'IntegrationInternal',
				fields: {
					name: 'String!',
					hash: 'String',
					path: 'String!',
					version: 'String',
				},
			}),
		},
	},
});
