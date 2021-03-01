import path from 'path';
import mime from 'mime';
import { v4 as uuid } from 'uuid';

export const asset = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const assets = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });

export const getSignedUrl = tc =>
	tc.schemaComposer.createResolver({
		name: 'getSignedUrl',
		type: 'JSON!',
		args: { filename: 'String!' },
		resolve: ({ args, context: { s3 } }) => {
			const ext = path.extname(args.filename);
			const type = mime.getType(ext);
			const name = `${uuid()}${ext}`;

			return {
				url: s3.getSignedUrl('putObject', {
					Bucket: process.env.AWS_S3_BUCKET,
					Key: name,
					Expires: 60 * 5,
					ContentType: type,
				}),
				path: `https://${process.env.AWS_S3_BUCKET}/${name}`,
				mime: type,
				name,
			};
		},
	});
