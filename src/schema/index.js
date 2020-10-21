import { SchemaComposer } from 'graphql-compose';

import Agent, { AgentModel } from './agent';
import Asset, { AssetModel } from './asset';
import Chat, { ChatModel } from './chat';
import Faq, { FaqModel } from './faq';
import Group, { GroupModel } from './group';
import Note, { NoteModel } from './note';
import Organization, { OrganizationModel } from './organization';
import Tag, { TagModel } from './tag';
import User, { UserModel } from './user';
import Webhook, { WebhookModel } from './webhook';

const schemaComposer = new SchemaComposer();

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

export default schemaComposer.buildSchema();

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
