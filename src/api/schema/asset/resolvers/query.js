import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';

const s3 = new AWS.S3();

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: 'us-east-1',
	signatureVersion: 'v4',
});

export const getSignedUrl = {
	name: 'getSignedUrl',
	type: 'AssetSignedURLPayload!',
	args: { filename: 'String!' },
	resolve: (_, args) => {
		const parts = args.filename.split('.');

		const extension = args.filename.split('.')[parts.length - 1];

		return {
			url: s3.getSignedUrl('putObject', {
				Bucket: process.env.AWS_S3_BUCKET,
				Key: args.filename,
				Expires: 5 * 60,
			}),
			mime: mime.lookup(extension),
			name: args.filename,
		};
	},
};
