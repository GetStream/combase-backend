import { SchemaComposer } from 'graphql-compose';

import Organization, { OrganizationModel } from './organization';
import Agent, { AgentModel } from './agent';
import Asset, { AssetModel } from './asset';
import User, { UserModel } from './user';
import Group, { GroupModel } from './group';
import Chat, { ChatModel } from './chat';
import Note, { NoteModel } from './note';
import Tag, { TagModel } from './tag';
import Faq, { FaqModel } from './faq';

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
});

export default schemaComposer.buildSchema();

export const Models = {
	Organization: OrganizationModel,
	Agent: AgentModel,
	Asset: AssetModel,
	User: UserModel,
	Group: GroupModel,
	Chat: ChatModel,
	Note: NoteModel,
	Tag: TagModel,
	Faq: FaqModel,
};
