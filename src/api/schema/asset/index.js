import schemaComposer from 'api/schema/composer';
import resolvers from './resolvers';
import { AssetTC } from './model';

schemaComposer.addTypeDefs(`
	type AssetSignedURLPayload {
		"""
		The signed URL to upload to. 
		"""
		url: String!
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

const Query = {
	assetById: AssetTC.mongooseResolvers.findById(),
	assetByIds: AssetTC.mongooseResolvers.findByIds(),
	assetOne: AssetTC.mongooseResolvers.findOne(),
	assetMany: AssetTC.mongooseResolvers.findMany(),
	assetCount: AssetTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	assetCreateOne: AssetTC.mongooseResolvers.createOne(),
	assetCreateMany: AssetTC.mongooseResolvers.createMany(),
	assetUpdateById: AssetTC.mongooseResolvers.updateById(),
	assetUpdateOne: AssetTC.mongooseResolvers.updateOne(),
	assetUpdateMany: AssetTC.mongooseResolvers.updateMany(),
	assetRemoveById: AssetTC.mongooseResolvers.removeById(),
	assetRemoveOne: AssetTC.mongooseResolvers.removeOne(),
	assetRemoveMany: AssetTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
