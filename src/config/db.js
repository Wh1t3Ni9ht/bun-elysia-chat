import chalk from 'chalk';

import mongoose from "mongoose";

const connectDB = async (app) => {
	console.log(chalk.yellow('Connecting to MongoDB...'));

	mongoose.connect(process.env.MONGO_DB_URL || "").catch((err) => {
		console.log(chalk.red('Error connecting to database'));
		console.log(err);
	});

	mongoose.connection.on("connected", () => {
		console.clear();
		console.log(chalk.green("Connected to MongoDB"));
		app.listen(3000);
		console.log(chalk.blue(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`));
	});

	// connection throws an error
	mongoose.connection.on("error", (err) => {
		console.log(chalk.red("MongoDB connection error:"));

		console.log(err);
	});

	// connection is disconnected
	mongoose.connection.on("disconnected", () => {
		console.log(chalk.magenta("MongoDB has disconnected!"));
	});
};




export default connectDB;
