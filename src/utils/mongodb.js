import mongoose from 'mongoose';

const mongodb = async (URI = process.env.MONGODB_URI) => {
	try {
		const client = mongoose.connect(URI, {
			autoIndex: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			poolSize: 10,
			useUnifiedTopology: true,
		});

		return await client;
	} catch (error) {
		throw new Error(error);
	}
};

export { mongodb };
