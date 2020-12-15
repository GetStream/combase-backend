import path from 'path';
import AWS from 'aws-sdk';
import mime from 'mime-types';
import { v4 as uuid } from 'uuid';

const s3 = new AWS.S3({
	apiVersion: '2006-03-01',
});

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
		const ext = path.extname(args.filename);
		const type = mime.lookup(ext);
		const name = `${uuid()}${ext}`;

		return {
			url: s3.getSignedUrl('putObject', {
				Bucket: process.env.AWS_S3_BUCKET,
				Key: name,
				Expires: 60 * 5,
				ContentType: type,
			}),
			path: type.includes('image') ? `${process.env.IMG_URL}/${name}` : `${process.env.CDN_URL}/${name}`,
			mime: type,
			name,
		};
	},
};
