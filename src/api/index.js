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
