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
	meta: [
		{
			type: Schema.Types.Mixed,
			description: 'Unstructured data associated with the integration.',
		},
	],
});

IntegrationCredentialsSchema.plugin(fieldEncryption, {
	fields: ['value', 'meta'],
	secret: process.env.AUTH_SECRET,
});

const IntegrationSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			description: 'The name of this integration',
		},
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization the Integration is associated with.',
		},
		triggers: [
			{
				type: String,
				required: true,
				trim: true,
				description: 'The trigger used to listen for event from this integration',
			},
		],
		credentials: [IntegrationCredentialsSchema],
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
			description:
				'Stringified Markdown from the README of an Integration Definition. Used by remark-react in the frontend to build the Interation "About" pages.',
			type: 'String',
			resolve: source => {
				/* eslint-disable no-sync */
				const readme = slash(path.join(source.internal.path, 'about.md'));
				let str = '';

				if (fs.existsSync(readme)) {
					str = fs.readFileSync(readme).toString();
				}

				return str;
				/* eslint-enable no-sync */
			},
		},
		configuration: 'JSON!',
		category: {
			description: 'Categories for this Integration',
			type: [IntegrationCategoryETC],
		},
		icon: 'String',
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
