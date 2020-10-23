import { AgentTC } from '../agent/model';

import { OrganizationTC } from './model';

OrganizationTC.addRelation('agents', {
	prepareArgs: {
		filter: ({ _id }) => ({ organization: _id }),
	},
	resolver: AgentTC.mongooseResolvers.findMany,
});

OrganizationTC.addRelation('agentCount', {
	prepareArgs: {
		filter: ({ _id }) => ({ organization: _id }),
	},
	resolver: AgentTC.mongooseResolvers.count,
});
