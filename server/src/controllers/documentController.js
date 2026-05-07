import Document from '../models/Document.js';
import { logAuditEvent } from '../middleware/audit.js';
import { ingestDocument } from '../services/mlBridge.js';
import path from 'path';
import fs from 'fs';

// POST /api/documents/upload
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { permissionLevel = 'member' } = req.body;
    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();

    const doc = await Document.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      fileType: ext,
      fileSize: req.file.size,
      permissionLevel,
      uploadedBy: req.user._id,
      uploadedByName: req.user.name,
      organizationId: req.user.organizationId,
    });

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'FILE_UPLOAD', ipAddress: req.ip, details: req.file.originalname,
    });

    // Trigger ML ingestion (Phase 2 — will gracefully fail if ML service is down)
    ingestDocument(doc._id, doc.filePath, doc.organizationId.toString());

    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};

// GET /api/documents
export const getDocuments = async (req, res, next) => {
  try {
    const { role, organizationId } = req.user;

    // Security Gatekeeper: filter by user's role
    let permissionFilter = {};
    if (role === 'guest') {
      permissionFilter = { permissionLevel: 'guest' };
    } else if (role === 'member') {
      permissionFilter = { permissionLevel: { $in: ['member', 'guest'] } };
    }
    // Admin sees all

    const documents = await Document.find({
      organizationId,
      ...permissionFilter,
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    // Members can only delete their own files
    if (req.user.role === 'member' && doc.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own uploads.' });
    }

    // Delete file from disk
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await Document.findByIdAndDelete(doc._id);

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'FILE_DELETE', ipAddress: req.ip, details: doc.originalName,
    });

    res.json({ message: 'Document deleted.' });
  } catch (error) {
    next(error);
  }
};
