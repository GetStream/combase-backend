import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import path from 'path';
import slash from 'slash';
import fs from 'fs-extra';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

import schemaComposer from 'api/schema/composer';

const IntegrationCredentialsSchema = new Schema({
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

IntegrationCredentialsSchema.plugin(fieldEncryption, {
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
		credentials: IntegrationCredentialsSchema,
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

export const IntegrationCategoryETC = schemaComposer.createEnumTC({
	name: 'EnumIntegrationCategory',
	values: {
		calendar: {
			value: 'calendar',
		},
		email: {
			value: 'email',
		},
		enrich: {
			value: 'enrich',
		},
	},
});

export const IntegrationDefinitionTC = schemaComposer.createObjectTC({
	name: 'IntegrationDefinition',
	fields: {
		about: {
			type: 'String!',
			resolve: source => {
				// eslint-disable-next-line no-sync
				return fs.readFileSync(slash(path.join(source.internal.path, 'README.md'))).toString();
			},
		},
		configuration: 'JSON!',
		category: {
			description: 'Categories for this Integration',
			type: [IntegrationCategoryETC],
		},
		id: 'String!',
		fields: 'JSON!',
		name: 'String!',
		triggers: 'JSON!',
		internal: {
			type: schemaComposer.createObjectTC({
				name: 'IntegrationInternal',
				fields: {
					name: 'String!',
					hash: 'String!',
					path: 'String!',
					version: 'String!',
				},
			}),
		},
	},
});
