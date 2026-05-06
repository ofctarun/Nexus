import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), auditLog('Upload Document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { permissionLevel } = req.body; // Admin, Member, Guest

    const doc = await Document.create({
      title: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      permissionLevel: permissionLevel || 'Guest',
      uploader: req.user._id,
      organization: req.user.organization
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const roleHierarchy = { 'Admin': ['Admin', 'Member', 'Guest'], 'Member': ['Member', 'Guest'], 'Guest': ['Guest'] };
    const allowedLevels = roleHierarchy[req.user.role];

    const docs = await Document.find({
      organization: req.user.organization,
      permissionLevel: { $in: allowedLevels }
    }).populate('uploader', 'name');
    
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, auditLog('Delete Document'), async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (req.user.role !== 'Admin' && doc.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    fs.unlinkSync(path.join(process.cwd(), doc.path));
    await doc.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
