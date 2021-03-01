import mongoose from 'mongoose';

import { AgentModel } from '../model';

export const agent = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const agents = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });

export const availableAgents = tc =>
	tc.schemaComposer.createResolver({
		name: 'getAvailable',
		description:
			'Same as agentMany but uses an aggregated query to return only agents that are avulable today, and includes a timezone-aware availability status for each agent.',
		type: '[Agent!]',
		args: { filter: 'FilterFindManyAgentInput' },
		resolve: ({ args, context }) => {
			const now = new Date();
			const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
			const userTimezone = 'Europe/Amsterdam';

			const organization = args?.filter?.organization || context.organization;

			return AgentModel.aggregate()
				.match({
					active: true,
					// eslint-disable-next-line new-cap
					organization: mongoose.Types.ObjectId(organization),
					[`schedule.${dayName}`]: {
						$elemMatch: {
							enabled: true,
						},
					},
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
				})
				.match({
					available: true,
				});
		},
	});

export const me = tc =>
	tc.schemaComposer.createResolver({
		name: 'me',
		type: tc,
		kind: 'query',
		args: {},
		resolve: ({ context: { agent: _id } }) => {
			if (!agent) {
				throw new Error('Unauthorized');
			}

			return AgentModel.findById(_id, { password: false }).lean();
		},
	});
