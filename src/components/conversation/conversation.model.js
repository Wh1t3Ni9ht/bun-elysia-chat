import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  type: { type: String, enum: ['private', 'group'], default: 'private' },
});

// Set the chat type based on the number of members
chatSchema.pre('save', function (next) {
  if (this.members.length > 2) {
    this.type = 'private';
    this.name = "Private Chat";
  } else {
    this.type = 'group';
  }

  next();
});

const messageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'chat' }, // Reference to Chat model
  sender: { type: Schema.Types.ObjectId, ref: 'user' }, // Reference to User model
  content: String,
  edited: { type: Boolean, default: false },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }],
  reactions: [{
    user: { type: Schema.Types.ObjectId, ref: 'user' }, // Reference to User model
    type: String,  // (Name of the emoji) Reaction type (e.g., 'like', 'love', 'haha')
    // Other fields related to reactions, like count, etc., can be added here
  }],
  isWithinThread: { type: Boolean, default: false },
  thread: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' }, // Reference to the parent message ID
  // Other message properties
}, {
  timestamps: true,
});

const Chat = mongoose.model("chat", chatSchema);
const Message = mongoose.model("message", messageSchema);

export default { Chat, Message };
