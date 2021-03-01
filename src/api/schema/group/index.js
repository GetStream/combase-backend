import './extend';
import resolvers from './resolvers';
import { GroupTC } from './model';

const Query = {
	group: GroupTC.mongooseResolvers.findById(),
	groups: GroupTC.mongooseResolvers.connection(),
	...resolvers.Query,
};

const Mutation = {
	groupCreate: GroupTC.mongooseResolvers.createOne(),
	groupUpdate: GroupTC.mongooseResolvers.updateById(),
	groupRemove: GroupTC.mongooseResolvers.removeById(),
	groupRemoveMany: GroupTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
