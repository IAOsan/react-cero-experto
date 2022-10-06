import mongoose from 'mongoose';

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('db online'))
	.catch((err) => console.log('db error connection: ', err));

// close connection if error exists
process.on('uncaughtException', () => {
	mongoose.connection.close();
});
