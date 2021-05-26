import mongoose from 'mongoose';

import { AgentModel } from '../model';

export const agent = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const agents = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });

export const search = tc => tc.algoliaResolvers.search();

export const availableAgents = tc =>
	tc.schemaComposer.createResolver({
		name: 'getAvailable',
		description:
			'Same as agentMany but uses an aggregated query to return only agents that are available today, and includes a timezone-aware availability status for each agent.',
		type: '[Agent!]',
		args: { filter: 'FilterFindManyAgentInput' },
		resolve: ({ args, context }) => {
			const now = new Date();
			const userTimezone = context?.timezone || 'Europe/Amsterdam';

			const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
			const organization = args?.filter?.organization || context.organization;

			return (
				AgentModel.aggregate()
					.match({
						active: true,
						// eslint-disable-next-line new-cap
						organization: mongoose.Types.ObjectId(organization),
					})
					// eslint-disable-next-line multiline-comment-style
					.addFields({
						available: {
							$anyElementTrue: {
								$map: {
									input: '$schedule',
									as: 'entry',
									in: {
										$cond: [
											{
												$and: [
													{
														$eq: ['$$entry.enabled', true],
													},
													{
														$anyElementTrue: {
															$map: {
																input: '$$entry.day',
																as: 'day',
																in: {
																	$eq: ['$$day', dayName],
																},
															},
														},
													},
													{
														$anyElementTrue: {
															$map: {
																input: '$$entry.time',
																as: 'time',
																in: {
																	$cond: [
																		{
																			$let: {
																				vars: {
																					startTime: {
																						$dateFromParts: {
																							hour: '$$time.start.hour',
																							minute: '$$time.start.minute',
																							timezone: '$timezone',
																							year: 2021,
																						},
																					},
																					endTime: {
																						$dateFromParts: {
																							hour: '$$time.end.hour',
																							minute: '$$time.end.minute',
																							timezone: '$timezone',
																							year: 2021,
																						},
																					},
																					userTime: {
																						$dateFromParts: {
																							hour: now.getHours(),
																							minute: now.getMinutes() + 1,
																							timezone: userTimezone,
																							year: 2021,
																						},
																					},
																				},
																				in: {
																					$and: [
																						{
																							$gte: ['$$userTime', '$$startTime'],
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
												],
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
					})
			);
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
