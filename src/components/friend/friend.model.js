import mongoose from "mongoose";
const autoPopulate = require("mongoose-autopopulate");

const friendSchema = new mongoose.Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' } }, // Reference to User model
  user2: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' } }, // Reference to User model
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

friendSchema.plugin(autoPopulate);

const Friend = mongoose.model("friend", friendSchema);

export default Friend;
