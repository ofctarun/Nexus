import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  action: { type: String, required: true },
  details: { type: String },
  ip_address: { type: String },
  result: { type: String, enum: ['Success', 'Failure'], default: 'Success' }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
