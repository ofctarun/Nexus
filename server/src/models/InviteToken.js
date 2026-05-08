import mongoose from 'mongoose';

const inviteTokenSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'guest'],
    default: 'member',
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  recipientEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedAt: Date,
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expiresAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const InviteToken = mongoose.model('InviteToken', inviteTokenSchema);
export default InviteToken;
