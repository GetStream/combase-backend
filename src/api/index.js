import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { mongodb } from '../utils/mongodb';
import { logger } from '../utils/logger';

import { chatCommandsHandler } from './webhooks/chatCommandsHandler';
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
});

app.use(cors());
app.use('/webhook-commands', bodyParser.json());
app.use('/webhook-commands', chatCommandsHandler);

const httpServer = http.createServer(app);

apollo.installSubscriptionHandlers(httpServer);

(async () => {
	try {
		await mongodb();

		httpServer.listen({ port: process.env.PORT || 8080 }, () => {
			logger.info(`🚀 Server ready at http(s)://<HOSTNAME>:${process.env.PORT}${apollo.graphqlPath}`);
		});
	} catch (error) {
		logger.error(error);
		// eslint-disable-next-line no-process-exit
		process.exit(1);
	}
})();
