import { schemaComposer } from 'graphql-compose';

import { schema as streamSchema } from 'api/plugins/graphql-stream';

import Agent from './agent';
import Asset from './asset';
import Chat from './chat';
import Faq from './faq';
import Group from './group';
import Note from './note';
import Organization from './organization';
import Tag from './tag';
import User from './user';
import Webhook from './webhook';
import { AgentModel } from './agent/model';
import { AssetModel } from './asset/model';
import { ChatModel } from './chat/model';
import { FaqModel } from './faq/model';
import { GroupModel } from './group/model';
import { NoteModel } from './note/model';
import { OrganizationModel } from './organization/model';
import { TagModel } from './tag/model';
import { UserModel } from './user/model';
import { WebhookModel } from './webhook/model';
import { RenameTypes, transformSchema } from 'apollo-server-express';

schemaComposer.merge(transformSchema(streamSchema, [new RenameTypes(name => `Stream${name}`)]));

schemaComposer.Query.addFields({
	...Agent.Query,
	...Asset.Query,
	...Chat.Query,
	...Faq.Query,
	...Group.Query,
	...Note.Query,
	...Organization.Query,
	...Tag.Query,
	...User.Query,
	...Webhook.Query,
});

schemaComposer.Mutation.addFields({
	...Agent.Mutation,
	...Asset.Mutation,
	...Chat.Mutation,
	...Faq.Mutation,
	...Group.Mutation,
	...Note.Mutation,
	...Organization.Mutation,
	...Tag.Mutation,
	...User.Mutation,
	...Webhook.Mutation,
});

schemaComposer.Subscription.addFields({
	...Agent.Subscription,
	...Chat.Subscription,
	...Organization.Subscription,
	...User.Subscription,
});

const schema = schemaComposer.buildSchema();

export default schema;

export const Models = {
	Agent: AgentModel,
	Asset: AssetModel,
	Chat: ChatModel,
	Faq: FaqModel,
	Group: GroupModel,
	Note: NoteModel,
	Organization: OrganizationModel,
	Tag: TagModel,
	User: UserModel,
	Webhook: WebhookModel,
};
