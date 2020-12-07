import 'dotenv/config';
import path from 'path';

import S3 from 'aws-sdk/clients/s3';
import { v4 as uuid } from 'uuid';

const s3 = (file, accessKey = process.env.AWS_ACCESS_KEY, accessSecret = process.env.AWS_SECRET_KEY) => {
	const aws = new S3({
		accessKeyId: accessKey,
		secretAccessKey: accessSecret,
		signatureVersion: 'v4',
	});

	const name = `${uuid()}${path.extname(file)}`;

	const url = aws.getSignedUrl('putObject', {
		Metadata: {
			fileName: name,
			uploadDateUTC: new Date(),
		},
		Bucket: process.env.AWS_S3_BUCKET,
		Key: `public/${name}`,
		Expires: 300,
	});

	return url;
};

export { s3 };
