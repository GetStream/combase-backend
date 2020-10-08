import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import WebhookSchema from "./model";

const Model = mongoose.model("Webhook", WebhookSchema);

const customizationOptions = {};
const WebhookTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  webhookById: WebhookTC.mongooseResolvers.findById,
  webhookByIds: WebhookTC.mongooseResolvers.findByIds,
  webhookOne: WebhookTC.mongooseResolvers.findOne,
  webhookMany: WebhookTC.mongooseResolvers.findMany,
  webhookCount: WebhookTC.mongooseResolvers.count,
});

schemaComposer.Muwebhooktion.addFields({
  webhookCreateOne: WebhookTC.mongooseResolvers.createOne,
  webhookCreateMany: WebhookTC.mongooseResolvers.createMany,
  webhookUpdateById: WebhookTC.mongooseResolvers.updateById,
  webhookUpdateOne: WebhookTC.mongooseResolvers.updateOne,
  webhookUpdateMany: WebhookTC.mongooseResolvers.updateMany,
  webhookRemoveById: WebhookTC.mongooseResolvers.removeById,
  webhookRemoveOne: WebhookTC.mongooseResolvers.removeOne,
  webhookRemoveMany: WebhookTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
