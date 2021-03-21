import path from 'path';
import mime from 'mime-types';

export const assetCreate = tc => {
	tc.schemaComposer.addTypeDefs(`
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

	const CreateOneAssetPayloadTC = tc.schemaComposer.getOTC(tc.mongooseResolvers.createOne().getType()).addFields({
		signedUrl: 'SignedURLPayload',
	});

	return tc.schemaComposer.createResolver({
		name: 'create',
		type: CreateOneAssetPayloadTC,
		args: { filename: 'String!' },
		resolve: async rp => {
			const {
				args,
				context: { organization, s3 },
			} = rp;

			if (!organization) {
				throw new Error('Unauthorized');
			}

			const ext = path.extname(args.filename);
			const type = mime.lookup(ext);

			const assetDoc = await tc.mongooseResolvers.createOne().resolve({
				...rp,
				args: {
					record: {
						type: type.split('/')[0],
						contentType: type,
						source: 's3',
						organization,
					},
				},
			});

			const ref = `${assetDoc.record._id.toString()}${ext}`;

			return {
				...assetDoc,
				signedUrl: {
					url: s3.getSignedUrl('putObject', {
						Bucket: process.env.AWS_S3_BUCKET,
						Key: ref,
						Expires: 60 * 5,
						ContentType: type,
					}),
					ref,
					path: `https://${process.env.AWS_S3_BUCKET}/${ref}`,
					mime: type,
					_id: assetDoc.record._id,
				},
			};
		},
	});
};

export const assetUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const assetRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const assetRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
