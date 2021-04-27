import { IntegrationModel } from "../../model";

export const integrationLookup = tc => tc.mongooseResolvers.findOne({
	filter: {
		operators: {
			triggers: ['in'],
		},
	},
}).clone({ name: 'lookup' })

export const integration = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const integrations = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
