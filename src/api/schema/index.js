import schemaComposer from 'api/schema/composer';
import chain from 'utils/composer-chain';

import { StreamActivity, StreamAddActivity } from './activity';
import Agent from './agent';
import Asset from './asset';
import Faq from './faq';
import Group from './group';
import { Integration, IntegrationDefinition } from './integration';
import Organization from './organization';
import Tag from './tag';
import Ticket from './ticket';
import User from './user';
import Webhook from './webhook';

chain([
	Agent,
	Asset,
	Faq,
	Group,
	Integration,
	IntegrationDefinition,
	Organization,
	StreamActivity,
	StreamAddActivity,
	Tag,
	Ticket,
	User,
	Webhook,
]);

schemaComposer.Query.addFields({
	/**
	 * @name Agent
	 */
	me: schemaComposer.getOTC('Agent').getResolver('me'),
	agent: schemaComposer.getOTC('Agent').getResolver('get'),
	agents: schemaComposer.getOTC('Agent').getResolver('list'),
	agentsAvailable: schemaComposer.getOTC('Agent').getResolver('getAvailable'),
	agentSearch: schemaComposer.getOTC('Agent').getResolver('search'),

	/**
	 * @name Asset
	 */
	asset: schemaComposer.getOTC('Asset').getResolver('get'),
	imageAsset: schemaComposer.getOTC('Asset').getResolver('getImage'),
	assets: schemaComposer.getOTC('Asset').getResolver('list'),

	/**
	 * @name Faq
	 */
	faq: schemaComposer.getOTC('Faq').getResolver('get'),
	faqs: schemaComposer.getOTC('Faq').getResolver('list'),

	/**
	 * @name Group
	 */
	group: schemaComposer.getOTC('Group').getResolver('get'),
	groups: schemaComposer.getOTC('Group').getResolver('list'),

	/**
	 * @name Integration
	 */
	integration: schemaComposer.getOTC('Integration').getResolver('get'),
	integrations: schemaComposer.getOTC('Integration').getResolver('list'),

	/**
	 * @name IntegrationDefinition
	 */
	integrationDefinition: schemaComposer.getOTC('IntegrationDefinition').getResolver('get'),
	integrationDefinitions: schemaComposer.getOTC('IntegrationDefinition').getResolver('list'),

	/**
	 * @name Organization
	 */
	organization: schemaComposer.getOTC('Organization').getResolver('get'),

	/**
	 * @name Tag
	 */
	tag: schemaComposer.getOTC('Tag').getResolver('get'),
	tags: schemaComposer.getOTC('Tag').getResolver('list'),

	/**
	 * @name Ticket
	 */
	ticket: schemaComposer.getOTC('Ticket').getResolver('get'),
	tickets: schemaComposer.getOTC('Ticket').getResolver('list'),

	/**
	 * @name User
	 */
	user: schemaComposer.getOTC('User').getResolver('get'),
	users: schemaComposer.getOTC('User').getResolver('list'),

	/**
	 * @name Webhook
	 */
	webhook: schemaComposer.getOTC('Webhook').getResolver('get'),
	webhooks: schemaComposer.getOTC('Webhook').getResolver('list'),
});

schemaComposer.Mutation.addFields({
	/**
	 * @name Agent
	 */
	agentCreate: schemaComposer.getOTC('Agent').getResolver('create'),
	agentUpdate: schemaComposer.getOTC('Agent').getResolver('update'),
	agentActivate: schemaComposer.getOTC('Agent').getResolver('activate'),
	agentDeactivate: schemaComposer.getOTC('Agent').getResolver('deactivate'),
	agentLogin: schemaComposer.getOTC('Agent').getResolver('login'),
	agentOnboard: schemaComposer.getOTC('Agent').getResolver('onboard'),
	agentAddToGroup: schemaComposer.getOTC('Agent').getResolver('addToGroup'),
	agentRemoveFromGroup: schemaComposer.getOTC('Agent').getResolver('removeFromGroup'),

	/**
	 * @name Asset
	 */
	assetCreate: schemaComposer.getOTC('Asset').getResolver('create'),
	assetUpdate: schemaComposer.getOTC('Asset').getResolver('update'),
	assetRemove: schemaComposer.getOTC('Asset').getResolver('remove'),
	assetRemoveMany: schemaComposer.getOTC('Asset').getResolver('removeMany'),

	/**
	 * @name FAQ
	 */
	faqCreate: schemaComposer.getOTC('Faq').getResolver('create'),
	faqUpdate: schemaComposer.getOTC('Faq').getResolver('update'),
	faqRemove: schemaComposer.getOTC('Faq').getResolver('remove'),
	faqRemoveMany: schemaComposer.getOTC('Faq').getResolver('removeMany'),
	faqAddTag: schemaComposer.getOTC('Faq').getResolver('addTag'),
	faqRemoveTag: schemaComposer.getOTC('Faq').getResolver('removeTag'),

	/**
	 * @name Group
	 */
	groupCreate: schemaComposer.getOTC('Group').getResolver('create'),
	groupUpdate: schemaComposer.getOTC('Group').getResolver('update'),
	groupRemove: schemaComposer.getOTC('Group').getResolver('remove'),
	groupRemoveMany: schemaComposer.getOTC('Group').getResolver('removeMany'),
	groupAddTag: schemaComposer.getOTC('Group').getResolver('addTag'),
	groupRemoveTag: schemaComposer.getOTC('Group').getResolver('removeTag'),

	/**
	 * @name Integrations
	 */
	integrationCreate: schemaComposer.getOTC('Integration').getResolver('create'),
	integrationUpdate: schemaComposer.getOTC('Integration').getResolver('update'),
	integrationRemove: schemaComposer.getOTC('Integration').getResolver('remove'),
	integrationRemoveMany: schemaComposer.getOTC('Integration').getResolver('removeMany'),

	/**
	 * @name Organization
	 */
	organizationUpdate: schemaComposer.getOTC('Organization').getResolver('update'),
	organizationCreateApiCredentials: schemaComposer.getOTC('Organization').getResolver('createApiCredentials'),
	generateMockData: schemaComposer.getOTC('Organization').getResolver('generateMockData'),

	/**
	 * @name Tag
	 */
	tagCreate: schemaComposer.getOTC('Tag').getResolver('create'),
	tagUpdate: schemaComposer.getOTC('Tag').getResolver('update'),
	tagRemove: schemaComposer.getOTC('Tag').getResolver('remove'),
	tagRemoveMany: schemaComposer.getOTC('Tag').getResolver('removeMany'),

	/**
	 * @name Ticket
	 */
	ticketAssign: schemaComposer.getOTC('Ticket').getResolver('assign'),
	ticketCreate: schemaComposer.getOTC('Ticket').getResolver('create'),
	ticketUpdate: schemaComposer.getOTC('Ticket').getResolver('update'),
	ticketMarkAs: schemaComposer.getOTC('Ticket').getResolver('markAs'),
	ticketTransfer: schemaComposer.getOTC('Ticket').getResolver('transfer'),
	ticketStar: schemaComposer.getOTC('Ticket').getResolver('star'),
	ticketSetPriority: schemaComposer.getOTC('Ticket').getResolver('setPriority'),
	ticketAddTag: schemaComposer.getOTC('Ticket').getResolver('addTag'),
	ticketRemoveTag: schemaComposer.getOTC('Ticket').getResolver('removeTag'),

	/**
	 * @name User
	 */
	userCreate: schemaComposer.getOTC('User').getResolver('create'),
	userGetOrCreate: schemaComposer.getOTC('User').getResolver('getOrCreate'),
	userUpdate: schemaComposer.getOTC('User').getResolver('update'),

	/**
	 * @name Webhook
	 */
	webhookCreate: schemaComposer.getOTC('Webhook').getResolver('create'),
	webhookUpdate: schemaComposer.getOTC('Webhook').getResolver('update'),
	webhookRemove: schemaComposer.getOTC('Webhook').getResolver('remove'),
	webhookRemoveMany: schemaComposer.getOTC('Webhook').getResolver('removeMany'),
});

schemaComposer.Subscription.addFields({});

export default schemaComposer.buildSchema();
