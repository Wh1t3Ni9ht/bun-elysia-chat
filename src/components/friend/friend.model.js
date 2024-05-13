import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'user' }, // Reference to User model
  user2: { type: Schema.Types.ObjectId, ref: 'user' }, // Reference to User model
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const Friend = mongoose.model("friend", friendSchema);

export default Friend;
