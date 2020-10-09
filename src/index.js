import "dotenv/config";

import http from "http";

import mongoose from "mongoose";
import express from "express";
import { ApolloServer } from "apollo-server-express";

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

apollo.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: process.env.PORT || 8080 }, () => {
  console.log(
    `API running on http://localhost:${process.env.PORT}${apollo.graphqlPath}`
  );
});
