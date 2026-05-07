import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'txt'],
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  permissionLevel: {
    type: String,
    enum: ['admin', 'member', 'guest'],
    default: 'member',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedByName: {
    type: String,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  // ML Processing Status (Phase 2)
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Index for fast org-scoped queries
documentSchema.index({ organizationId: 1, permissionLevel: 1 });

const Document = mongoose.model('Document', documentSchema);
export default Document;
