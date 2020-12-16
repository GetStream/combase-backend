import mongoose from 'mongoose';

import './relations';
import './extend';
import resolvers from './resolvers';
import { AgentTC } from './model';
import { enrichWithAuthToken } from 'utils/resolverMiddlewares/auth';
import { syncAgentProfile } from 'utils/resolverMiddlewares/streamChat';
import { createAgentFeedRelationships } from 'utils/resolverMiddlewares/streamFeeds';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

AgentTC.getITC('FilterFindManyAgentInput').addFields({
	available: 'Boolean',
});

AgentTC.mongooseResolvers.findManyAgg = () => ({
	name: 'findManyAgg',
	description:
		'Same as agentMany but uses an aggregated query to include a timezone-aware availability status for each agent. You can also filter by availability.',
	type: '[Agent!]',
	args: { filter: 'FilterFindManyAgentInput' },
	resolve: (source, args, context) => {
		if (!context.organization) {
			throw new Error('Unauthorized');
		}

		const now = new Date();
		const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
		const userTimezone = 'Europe/Amsterdam';

		const additionalMatchArgs = {};

		if (typeof args?.filter?.available !== 'undefined') {
			additionalMatchArgs[`schedule.${dayName}`] = {
				$elemMatch: {
					enabled: true,
				},
			};
		}

		return context.models.Agent.aggregate()
			.match({
				active: true,
				// eslint-disable-next-line new-cap
				organization: mongoose.Types.ObjectId(context.organization),
				...additionalMatchArgs,
			})
			.addFields({
				available: {
					$anyElementTrue: {
						$map: {
							input: `$schedule.${dayName}`,
							as: 'today',
							in: {
								$cond: [
									{
										$let: {
											vars: {
												startTime: {
													$dateFromParts: {
														hour: '$$today.start.hour',
														minute: '$$today.start.minute',
														timezone: '$timezone',
														year: 2020,
													},
												},
												endTime: {
													$dateFromParts: {
														hour: '$$today.end.hour',
														minute: '$$today.end.minute',
														timezone: '$timezone',
														year: 2020,
													},
												},
												userTime: {
													$dateFromParts: {
														hour: now.getHours(),
														minute: now.getMinutes() + 1,
														timezone: userTimezone,
														year: 2020,
													},
												},
											},
											in: {
												$and: [
													{
														$gt: ['$$userTime', '$$startTime'],
													},
													{
														$lt: ['$$userTime', '$$endTime'],
													},
												],
											},
										},
									},
									true,
									false,
								],
							},
						},
					},
				},
			});
	},
});

const Query = {
	agentById: AgentTC.mongooseResolvers.findById().withMiddlewares([organizationFilter]),
	agentMany: AgentTC.mongooseResolvers.findMany().withMiddlewares([organizationFilter]),
	agentCount: AgentTC.mongooseResolvers.count().withMiddlewares([organizationFilter]),
	agents: AgentTC.mongooseResolvers.findManyAgg(),
	...resolvers.Query,
};

const Mutation = {
	agentCreate: AgentTC.mongooseResolvers.createOne().withMiddlewares([createAgentFeedRelationships, syncAgentProfile, enrichWithAuthToken]),
	agentUpdate: AgentTC.mongooseResolvers.updateById().withMiddlewares([syncAgentProfile]),
	agentRemove: AgentTC.mongooseResolvers.removeById(),
	agentRemoveMany: AgentTC.mongooseResolvers.removeMany().withMiddlewares([organizationFilter]),
	...resolvers.Mutation,
};

const Subscription = {
	...resolvers.Subscription,
};

export default {
	Query,
	Mutation,
	Subscription,
};
