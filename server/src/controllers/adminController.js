import User from '../models/User.js';
import Document from '../models/Document.js';
import ChatSession from '../models/ChatSession.js';
import { logAuditEvent } from '../middleware/audit.js';
import fs from 'fs';

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalDocuments, queriesToday, activeUsers] = await Promise.all([
      User.countDocuments({ organizationId: orgId }),
      Document.countDocuments({ organizationId: orgId }),
      ChatSession.countDocuments({
        organizationId: orgId,
        'messages.timestamp': { $gte: today },
      }),
      User.countDocuments({ organizationId: orgId, isActive: true }),
    ]);

    res.json({ totalUsers, totalDocuments, queriesToday, activeUsers });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ organizationId: req.user.organizationId })
      .select('name email role isActive createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'member', 'guest'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found.' });

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'ROLE_CHANGE', ipAddress: req.ip, details: `Changed ${user.name} to ${role}`,
    });

    res.json({ message: 'Role updated.', user });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/deactivate
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      { isActive: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found.' });

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'USER_DEACTIVATED', ipAddress: req.ip, details: `Deactivated ${user.name}`,
    });

    res.json({ message: 'User deactivated.', user });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/documents
export const getAdminDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/documents/:id
export const adminDeleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await Document.findByIdAndDelete(doc._id);

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'FILE_DELETE', ipAddress: req.ip, details: `Admin deleted: ${doc.originalName}`,
    });

    res.json({ message: 'Document deleted.' });
  } catch (error) {
    next(error);
  }
};
