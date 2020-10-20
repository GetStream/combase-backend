import { stitchSchemas } from '@graphql-tools/stitch';

import { OrganizationSchema, OrganizationModel } from './organization';
import { AgentSchema, AgentModel } from './agent';
import { UserSchema, UserModel } from './user';
import { GroupSchema, GroupModel } from './group';
import { ChatSchema, ChatModel } from './chat';
import { NoteSchema, NoteModel } from './note';
import { TagSchema, TagModel } from './tag';
import { FaqSchema, FaqModel } from './faq';

export default stitchSchemas({
	schemas: [OrganizationSchema, GroupSchema, AgentSchema, UserSchema, ChatSchema, NoteSchema, TagSchema, FaqSchema],
});

export const Models = {
	Organization: OrganizationModel,
	Agent: AgentModel,
	User: UserModel,
	Group: GroupModel,
	Chat: ChatModel,
	Note: NoteModel,
	Tag: TagModel,
	Faq: FaqModel,
};
