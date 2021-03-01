import path from 'path';
import mime from 'mime';
import { v4 as uuid } from 'uuid';

export const getSignedUrl = tc => {
	const SignedURLPayloadTC = tc.schemaComposer.addTypeDefs(`
		type SignedURLPayload {
			"""
			The signed URL to upload to. 
			"""
			url: String!
			"""
			The absolute URL path of the file.
			"""
			path: String!
			"""
			The mime type of the file.
			"""
			mime: String!
			"""
			The generated filename.
			"""
			name: String!
		}
	`);

	return tc.schemaComposer.createResolver({
		name: 'getSignedUrl',
		type: SignedURLPayloadTC,
		args: { filename: 'String!' },
		resolve: ({
			args,
			context: {
				dataSources: { s3 },
			},
		}) => {
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
};
