import "dotenv/config";
import http from "http";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { connectToMongo } from "models";
import { resolvers, typeDefs } from "schema";

const apollo = new ApolloServer({
  cors: true,
  introspection: process.env.NODE_ENV !== "production",
  path: "/",
  playground: process.env.NODE_ENV !== "production",
  resolvers,
  tracing: process.env.NODE_ENV !== "production",
  typeDefs,
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

connectToMongo().then(() => {
  httpServer.listen({ port: process.env.PORT || "8000" }, () => {
    console.log(
      `API live on http://localhost:${process.env.PORT}${apollo.graphqlPath}`
    );
    console.log(
      `API Subscriptions live on ws://localhost:${process.env.PORT}${apollo.subscriptionsPath}`
    );
  });
});
