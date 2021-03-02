import 'dotenv/config';
import { v4 as uuid } from 'uuid';
import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

import schemaComposer from 'api/schema/composer';
import { AgentTC } from 'api/schema/agent/model';

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
		widget: {
			home: {
				title: {
					type: String,
					trim: true,
					default: 'Welcome 👋',
					description: 'The title message of displayed on the widget home screen.',
				},
				tagline: {
					type: String,
					trim: true,
					default: "We're here to help! Let us know if you have any questions",
					description: 'The tageline message displayed beneath the title in the widget home screen',
				},
			},
			domains: [
				{
					type: String,
					default: 'localhost',
					description: 'Allowed root domain and path to display widget on.',
				},
			],
		},
		secrets: [
			{
				name: {
					type: String,
					default: 'Default API secret',
					description: 'A user generated description of the what the API secret will be used for.',
				},
				value: {
					type: String,
					default: () => uuid(),
					description: 'A random API secret generated to sign a JWT.',
				},
				scope: {
					description: 'The scope for the secret.',
					type: String,
					enum: ['r', 'w', 'rw'],
					default: 'r',
				},
			},
		],
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

const OrganizationModel = mongoose.model('Organization', OrganizationSchema);
const OrganizationTC = composeMongoose(OrganizationModel, { schemaComposer });

OrganizationTC.addRelation('availableAgents', {
	prepareArgs: {
		filter: ({ _id }) => ({
			organization: _id.toString(),
		}),
	},
	projection: { _id: true },
	resolver: () => AgentTC.mongooseResolvers.findManyAvailable(),
});

export { OrganizationModel, OrganizationTC };
