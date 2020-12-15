import schemaComposer from 'api/schema/composer';
import awsSchema from './awsSchema';

import Activity from './activity';
import Agent from './agent';
import Asset from './asset';
import Ticket from './ticket';
import Faq from './faq';
import Group from './group';
import Note from './note';
import Organization from './organization';
import Tag from './tag';
import User from './user';
import Webhook from './webhook';
import { AgentModel } from './agent/model';
import { AssetModel } from './asset/model';
import { TicketModel } from './ticket/model';
import { FaqModel } from './faq/model';
import { GroupModel } from './group/model';
import { NoteModel } from './note/model';
import { OrganizationModel } from './organization/model';
import { TagModel } from './tag/model';
import { UserModel } from './user/model';
import { WebhookModel } from './webhook/model';

schemaComposer.merge(awsSchema);

schemaComposer.Query.addFields({
	...Activity.Query,
	...Agent.Query,
	...Asset.Query,
	...Ticket.Query,
	...Faq.Query,
	...Group.Query,
	...Note.Query,
	...Organization.Query,
	...Tag.Query,
	...User.Query,
	...Webhook.Query,
});

schemaComposer.Mutation.addFields({
	...Activity.Mutation,
	...Agent.Mutation,
	...Asset.Mutation,
	...Ticket.Mutation,
	...Faq.Mutation,
	...Group.Mutation,
	...Note.Mutation,
	...Organization.Mutation,
	...Tag.Mutation,
	...User.Mutation,
	...Webhook.Mutation,
});

schemaComposer.Subscription.addFields({
	...Activity.Subscription,
	...Agent.Subscription,
	...Ticket.Subscription,
	...Organization.Subscription,
	...User.Subscription,
});

const schema = schemaComposer.buildSchema();

export default schema;

export const Models = {
	Agent: AgentModel,
	Asset: AssetModel,
	Ticket: TicketModel,
	Faq: FaqModel,
	Group: GroupModel,
	Note: NoteModel,
	Organization: OrganizationModel,
	Tag: TagModel,
	User: UserModel,
	Webhook: WebhookModel,
};
