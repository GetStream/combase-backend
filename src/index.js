import "dotenv/config";

import http from "http";

import mongoose from "mongoose";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import logger from "./utils/logger";
import mongoConnection from "./utils/db";
import schema from "./schema";

const apollo = new ApolloServer({
  cors: true,
  introspection: process.env.NODE_ENV !== "production",
  path: "/",
  playground: process.env.NODE_ENV !== "production",
  tracing: process.env.NODE_ENV !== "production",
  schema,
});

const app = express();

app.disable("x-powered-by");

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
  path: "/graphql",
});

const httpServer = http.createServer(app);

(async () => {
  try {
    await mongoConnection(process.env.MONGODB_URI);

    httpServer.listen({ port: process.env.PORT || 8080 }, () => {
      logger.info(`MongoDB connection successful 👨‍🚀`);
      logger.info(`API running on port ${process.env.PORT} 🚀`);
    });

    return true;
  } catch (error) {
    logger.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
})();
