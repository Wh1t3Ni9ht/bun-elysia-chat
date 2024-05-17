import mongoose from "mongoose";
const autoPopulate = require("mongoose-autopopulate");

const friendSchema = new mongoose.Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' }, alias: "requester" },
  user2: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' }, alias: "recipient" },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
}, { timestamps: true });

friendSchema.plugin(autoPopulate);

const Friendship = mongoose.model("friend", friendSchema);

export default Friendship;
