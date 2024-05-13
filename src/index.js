import { Elysia, t } from "elysia";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

// Routes
import users from "./components/user/user.routes.js";

const connectedSockets = new Map();

const app = new Elysia()
	.get('/', () => {
		return 'Hello, World!';
	})
	.use(users)
	.ws("/", {
		// validate incoming message
		body: t.Object({
			text: t.String(),
			eventName: t.String(),
			senderNickname: t.String(),
			receiverSocketId: t.String(),
		}),
		message(ws, data) {
			const { text, eventName, senderNickname, receiverSocketId } = data;

			if (eventName === "message") {
				connectedSockets.get(receiverSocketId).send(
					JSON.stringify({
						senderSocketId: ws.id,
						text,
						senderNickname,
						eventName,
					}),
				);
			}
		},
		open(ws) {
			const generatedSocketId = crypto.randomUUID();
			ws.id = generatedSocketId;
			connectedSockets.set(generatedSocketId, ws);
			// console.log(connectedSockets);
			ws.send({
				senderSocketId: generatedSocketId,
				eventName: "connected",
			});
		},
		close(ws) {
			connectedSockets.delete(ws.id);
		},
	})

await connectDB(app);

process.on("SIGINT", async () => {
	try {
		await mongoose.connection.close();
		console.log("Mongoose connection closed due to application termination");
		process.exit(0);
	} catch (error) {
		console.log(`Error closing Mongoose connection: ${error}`);
		process.exit(1);
	}
});
