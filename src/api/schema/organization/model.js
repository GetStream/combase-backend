import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

import schemaComposer from 'api/schema/composer';

const StreamCredentialsSchema = new Schema({
	appId: {
		type: String,
		trim: true,
		default: '',
		description: 'The Stream App ID associated with the organization.',
		required: true,
	},
	key: {
		type: String,
		trim: true,
		default: '',
		description: 'The Stream App Key associated with the organization.',
		required: true,
	},
	secret: {
		type: String,
		trim: true,
		default: '',
		description: 'The Stream App Secret associated with the organization.',
		required: true,
	},
});

StreamCredentialsSchema.plugin(fieldEncryption, {
	fields: ['key', 'secret'],
	secret: process.env.AUTH_SECRET,
});

const OrganizationSchema = new Schema(
	{
		name: {
			required: true,
			type: String,
			description: 'Display name of the organization.',
		},
		contact: {
			email: {
				type: String,
				trim: true,
				lowercase: true,
				required: true,
				description: 'Default email address associated with the organization.',
			},
			phone: {
				type: String,
				trim: true,
				default: '',
				description: 'Default phone number associated with the organization.',
			},
		},
		branding: {
			logo: {
				type: String,
				trim: true,
				description: 'An absolute URL to the logo of the organization.',
			},
			colors: {
				primary: {
					type: String,
					trim: true,
					description: 'Primary color for the organization – HEX value.',
				},
				secondary: {
					type: String,
					trim: true,
					description: 'Secondary color for the organization – HEX value.',
				},
			},
		},
		stream: StreamCredentialsSchema,
		theme: {
			description: "The organization's custom theme values to be merged with the client-side theme.",
			type: JSON,
		},
		active: {
			type: Boolean,
			default: true,
			description: 'Status of the organization – an organization is never removed from history in order to preserve the timeline.',
		},
	},
	{ collection: 'organizations' }
);

OrganizationSchema.plugin(timestamps);

OrganizationSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const OrganizationModel = mongoose.model('Organization', OrganizationSchema);
export const OrganizationTC = composeMongoose(OrganizationModel, { schemaComposer });
