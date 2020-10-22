import resolvers from './resolvers';
import { AssetTC } from './model';

const Query = {
	assetById: AssetTC.mongooseResolvers.findById,
	assetByIds: AssetTC.mongooseResolvers.findByIds,
	assetOne: AssetTC.mongooseResolvers.findOne,
	assetMany: AssetTC.mongooseResolvers.findMany,
	assetCount: AssetTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	assetCreateOne: AssetTC.mongooseResolvers.createOne,
	assetCreateMany: AssetTC.mongooseResolvers.createMany,
	assetUpdateById: AssetTC.mongooseResolvers.updateById,
	assetUpdateOne: AssetTC.mongooseResolvers.updateOne,
	assetUpdateMany: AssetTC.mongooseResolvers.updateMany,
	assetRemoveById: AssetTC.mongooseResolvers.removeById,
	assetRemoveOne: AssetTC.mongooseResolvers.removeOne,
	assetRemoveMany: AssetTC.mongooseResolvers.removeMany,
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
