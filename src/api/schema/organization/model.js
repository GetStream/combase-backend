import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';

import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

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
		hours: [
			{
				enabled: {
					type: Boolean,
					default: false,
					description: 'Whether this day is enabled on the schedule.',
				},
				day: {
					type: Number,
					required: true,
					enum: [1, 2, 3, 4, 5, 6, 7],
					description: 'The date this availability schedule relates to [week day as a non-zero-based numeral representation].',
				},
				start: {
					hour: {
						type: Number,
						min: 0,
						max: 23,
						default: 12,
						required: true,
						description: 'Start of availability for this day [hour as a numeral representation].',
					},
					minute: {
						type: Number,
						min: 0,
						max: 59,
						default: 0,
						required: true,
						description: 'Start of availability for this day [minute as a numeral representation].',
					},
				},
				end: {
					hour: {
						type: Number,
						min: 0,
						max: 23,
						default: 12,
						required: true,
						description: 'End of availability for this day [hour as a numeral representation].',
					},
					minute: {
						type: Number,
						min: 0,
						max: 59,
						default: 0,
						required: true,
						description: 'End of availability for this day [minute as a numeral representation].',
					},
				},
			},
		],
		timezone: {
			type: String,
			default: 'Europe/London',
			description: 'The UTC timezone name. [defaults to GMT (Europe/London)]',
		},
		stream: StreamCredentialsSchema,
		theme: {
			description: "The organization's custom theme values to be merged with the client-side theme.",
			type: JSON,
		},
	},
	{ collection: 'organizations' }
);

OrganizationSchema.plugin(timestamps);
OrganizationSchema.plugin(events);

OrganizationSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const OrganizationModel = mongoose.model('Organization', OrganizationSchema);
export const OrganizationTC = composeMongoose(OrganizationModel);
