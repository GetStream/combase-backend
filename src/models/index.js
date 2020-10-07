import mongoose from "mongoose";

import Organization from "./organization";

mongoose.Promise = global.Promise;

export const connectToMongo = () =>
  mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
    bufferMaxEntries: 0,
    keepAlive: 120,
    poolSize: 50,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export default {
  Organization,
};
