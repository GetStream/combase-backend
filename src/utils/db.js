import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  try {
    const client = mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      poolSize: 10,
      useUnifiedTopology: true,
    });

    return await client;
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
})();
