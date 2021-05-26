import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';

import { mongodb } from '../utils/mongodb';
import { logger } from '../utils/logger';

import context from './context';
import schema from './schema';
import { algolia } from 'utils/search';

const apollo = new ApolloServer({
	cors: true,
	context,
	introspection: process.env.NODE_ENV !== 'production',
	path: '/',
	playground: process.env.NODE_ENV !== 'production',
	tracing: process.env.NODE_ENV !== 'production',
	schema,
});

const app = express();

apollo.applyMiddleware({
	app,
	cors: true,
	onHealthCheck: () =>
		new Promise((resolve, reject) => {
			if (mongoose.connection.readyState > 0) {
				resolve();
			} else {
				reject();
			}
		}),
	path: '/graphql',
	subscriptions: {
		path: '/graphql',
	},
});

app.use(cors());

const httpServer = http.createServer(app);

apollo.installSubscriptionHandlers(httpServer);

(async () => {
	try {
		await mongodb();

		/* eslint-disable multiline-comment-style */
		// Hacky synchronization to bulk add existing agents to algolia to debug/test
		// const agents = await mongo.model('Agent').find();

		// const agentDocs = agents.map(({ _doc: agent }) => ({
		// 	objectID: agent._id.toString(),
		// 	organization: agent.organization.toString(),
		// 	name: agent.name,
		// 	role: agent.role,
		// 	email: agent.email,
		// 	timezone: agent.timezone,
		// }));

		// await algolia.initIndex('AGENTS').saveObjects(agentDocs);
		/* eslint-enable multiline-comment-style */

		const port = process.env.PORT;

		httpServer.listen({ port }, () => {
			logger.info(`🚀 //:${port}${apollo.graphqlPath} • 🔁 //:${port}${apollo.subscriptionsPath} • Combase API 💬`);
		});
	} catch (error) {
		logger.error(error);
		// eslint-disable-next-line no-process-exit
		process.exit(1);
	}
})();
