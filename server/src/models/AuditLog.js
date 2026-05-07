import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'FILE_UPLOAD',
      'FILE_DELETE',
      'QUERY_SENT',
      'ROLE_CHANGE',
      'USER_DEACTIVATED',
      'ACCOUNT_DELETED',
      'PROFILE_UPDATED',
      'PASSWORD_CHANGED',
    ],
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  result: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success',
  },
  details: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient log queries
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
