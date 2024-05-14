import mongoose from "mongoose";
const autoPopulate = require("mongoose-autopopulate");

const chatSchema = new mongoose.Schema({
  name: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' } }],
  type: { type: String, enum: ['private', 'group'], default: 'private' },
}, { timestamps: true });

// Set the chat type based on the number of members
chatSchema.pre('save', function(next) {
  if (this.members.length > 2) {
    this.type = 'private';
  } else {
    this.type = 'group';
  }

  next();
});

chatSchema.plugin(autoPopulate);

const messageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'chat', autopopulate: true }, // Reference to Chat model
  sender: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' } }, // Reference to User model
  content: { type: String, default: "" },
  edited: { type: Boolean, default: false },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    path: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
  }],
  reactions: [{
    user: { type: Schema.Types.ObjectId, ref: 'user', autopopulate: { select: '-password' } }, // Reference to User model
    type: String,  // (e.g. Name of the emoji) Reaction type (e.g., 'like', 'love', 'haha')
    count: { type: Number, default: 0 },
  }],
  isWithinThread: { type: Boolean, default: false },
  thread: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', autopopulate: true }],
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message', autopopulate: true }, // Reference to the parent message ID
  // Other message properties
}, { timestamps: true });

messageSchema.plugin(autoPopulate);

const Chat = mongoose.model("chat", chatSchema);
const Message = mongoose.model("message", messageSchema);

export default { Chat, Message };
