import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';

import { mongodb } from 'utils/mongodb';
import { logger } from 'utils/logger';
// import { webhook } from 'utils/webhook';

import context from './context';
import schema from './schema';

const apollo = new ApolloServer({
	cors: true,
	context,
	introspection: process.env.NODE_ENV !== 'production',
	path: '/',
	playground: true,
	tracing: process.env.NODE_ENV !== 'production',
	schema,
});

const app = express();

// app.use(webhook);

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
