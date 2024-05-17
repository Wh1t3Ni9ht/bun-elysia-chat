import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

// 0 = Private, 1 = Friends, 2 = Everyone

const preferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', autopopulate: true },
  emailVisibility: { type: Number, enum: [0, 1, 2], default: 0 },
  onlineStatusVisibility: { type: Number, enum: [0, 1, 2], default: 1 },
  locationVisibility: { type: Number, enum: [0, 1, 2], default: 0 },
  bioVisibility: { type: Number, enum: [0, 1, 2], default: 2 },
  lastSeenVisibility: { type: Number, enum: [0, 1, 2], default: 1 },
  profilePictureVisibility: { type: Number, enum: [0, 1, 2], default: 2 },
  twoFactorAuthentication: { type: Boolean, default: false },
  readReceipts: { type: Boolean, default: true },
});

preferenceSchema.plugin(autoPopulate);

const Preference = mongoose.model('preference', preferenceSchema);

export default Preference;
