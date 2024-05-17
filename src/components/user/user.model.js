import Bun from "bun";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: [3, "Username must be at least 3 characters long"],
		maxlength: [24, "Username must be at most 24 characters long"],
	},

	email: {
		type: String,
		required: true,
		unique: true,
		maxlength: [60, "Email must be at most 50 characters long"],
	},

	password: {
		type: String,
		required: true,
		minlength: [8, "Password must be at least 8 characters long"],
		maxlength: [24, "Password must be at most 18 characters long"],
	},
}, { timestamps: true });

userSchema.pre("save", async function(next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await Bun.password.hash(user.password, {
			algorithm: "bcrypt",
			cost: 10,
		});

		next();
	}
})

const confirmationTokenSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId },

	token: {
		type: String,
		required: true,
		unique: true,
	},
})

const ConfirmationToken = mongoose.model("confirmationToken", confirmationTokenSchema);

const User = mongoose.model("user", userSchema);

export { User, ConfirmationToken };
