import { Elysia, t } from "elysia";

import userController from "./user.controller";

const users = new Elysia({ prefix: "/user" })
	.post("/signup", userController.signup, {
		body: t.Object({
			username: t.String(),
			email: t.String(),
			password: t.String(),
		}),
		response: {
			201: t.Object({
				error: t.Null(),
				data: t.Object({
					message: t.String(),
					user: t.Object({
						username: t.String(),
						email: t.String(),
					})
				})
			}),
			400: t.Object({
				data: t.Null(),
				error: t.Object({
					name: t.String(),
					message: t.String(),
				})
			}),
			500: t.Object({
				data: t.Null(),
				error: t.Object({
					name: t.String(),
					message: t.String(),
				})
			})
		}
	})
	.post("/signin", userController.signin, {
		body: t.Object({
			usernameOrEmail: t.String(),
			password: t.String(),
		})
	})
	.get("/profile", userController.profile, {
		cookie: t.Object({
			auth: t.String(),
		})
	})
	.get("/signout", userController.signout, {
		cookie: t.Object({
			auth: t.String(),
		})
	})
	.delete("/delete", userController.deleteUser, {
		cookie: t.Object({
			auth: t.String(),
		})
	});


export default users;
