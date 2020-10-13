import "dotenv/config";
import mongoose from "mongoose";

import logger from "./utils/logger";

const mongoConnection = async (uri) => {
  try {
    const client = mongoose.connect(uri, {
      autoIndex: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      poolSize: 10,
      useUnifiedTopology: true,
    });

    return await client;
  } catch (error) {
    logger.error(error);

    return error;
  }
};

export default mongoConnection;
