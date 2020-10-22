import { OrganizationTC } from '../organization/model';

import { AgentTC } from './model';

AgentTC.addRelation('organization', {
	prepareArgs: {
		_id: source => source.organization,
	},
	resolver: OrganizationTC.mongooseResolvers.findById,
});
