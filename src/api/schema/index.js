import { SchemaComposer } from 'graphql-compose';

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

const schemaComposer = new SchemaComposer();

// TODO TEMP: going to move these.
schemaComposer.addTypeDefs(`
	type InternalEntityMutationEvent {
		_id: String!
		ref: String!
		collection: String!
	}

	interface StreamFeedsActivity {
		actor: String!
		verb: String!
		object: String!
		time: String
		to: [String!] 
		foreign_id: String
	}

	type ActivityItem implements StreamFeedsActivity {
		actor: String!
		verb: String!
		object: String!
		time: String
		to: [String!] 
		foreign_id: String
	}

	type FeedSubscriptionPayload {
		deleted: [ActivityItem]
		deleted_foreign_ids: [String]
		feed: String!
		new: [ActivityItem]
	}
	
	type FlatFeedPayload {
		duration: String!
		next: String!
		results: [ActivityItem]
	}
`);

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
	...Organization.Subscription,
	...User.Subscription,
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
