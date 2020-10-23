import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

const StreamCredentialsSchema = new Schema({
	key: {
		type: String,
		trim: true,
		default: '',
		description: 'The Stream App Key associated with the organization.',
	},
	secret: {
		type: String,
		trim: true,
		default: '',
		description: 'The Stream App Secret associated with the organization.',
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
	},
	{ collection: 'organizations' }
);

OrganizationSchema.plugin(timestamps);

OrganizationSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const OrganizationModel = mongoose.model('Organization', OrganizationSchema);
export const OrganizationTC = composeMongoose(OrganizationModel);
