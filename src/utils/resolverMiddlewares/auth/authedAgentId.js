export const authedAgentId = (resolve, source, args, context, info) => resolve(source, { _id: context.agent }, context, info);
