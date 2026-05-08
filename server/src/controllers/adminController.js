import User from '../models/User.js';
import Organization from '../models/Organization.js';
import InviteToken from '../models/InviteToken.js';
import Document from '../models/Document.js';
import ChatSession from '../models/ChatSession.js';
import { sendInvitationEmail } from '../utils/emailService.js';
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

// POST /api/admin/invites
export const createInviteToken = async (req, res, next) => {
  try {
    const { role, level } = req.body;
    const organizationId = req.user.organizationId;
    const allowedRoles = ['admin', 'member', 'guest'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    const parsedLevel = Number(level) || 1;
    if (parsedLevel < 1 || parsedLevel > 10) {
      return res.status(400).json({ message: 'Hierarchy level must be between 1 and 10.' });
    }

    let code = '';
    let exists = true;
    while (exists) {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      code = `NXS-${code.slice(0, 4)}-${code.slice(4, 8)}`;
      exists = await InviteToken.exists({ code }) || await Organization.exists({ inviteCode: code });
    }

    const inviteToken = await InviteToken.create({
      code,
      organizationId,
      role,
      level: parsedLevel,
      createdBy: req.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await logAuditEvent({
      userId: req.user._id,
      userName: req.user.name,
      organizationId,
      action: 'INVITE_GENERATED',
      ipAddress: req.ip,
      details: `Generated invite token for role ${role} level ${parsedLevel}`,
    });

    res.status(201).json({ code: inviteToken.code, role: inviteToken.role, level: inviteToken.level, expiresAt: inviteToken.expiresAt });
  } catch (error) {
    console.error('Invite generation failed:', error);
    next(error);
  }
};

// POST /api/admin/invites/send
export const sendInviteEmail = async (req, res, next) => {
  try {
    const { code, email } = req.body;
    if (!code || !email) {
      return res.status(400).json({ message: 'Code and email are required.' });
    }

    const inviteToken = await InviteToken.findOne({ code, organizationId: req.user.organizationId });
    if (!inviteToken) {
      return res.status(404).json({ message: 'Invitation code not found.' });
    }

    if (inviteToken.isUsed) {
      return res.status(400).json({ message: 'This invitation code has already been used.' });
    }

    if (inviteToken.expiresAt && inviteToken.expiresAt < new Date()) {
      return res.status(400).json({ message: 'This invitation code has expired.' });
    }

    if (inviteToken.recipientEmail && inviteToken.recipientEmail !== email.toLowerCase()) {
      return res.status(400).json({ message: 'This invite code is reserved for a different email address.' });
    }

    inviteToken.recipientEmail = email.toLowerCase();
    await inviteToken.save();

    const organization = await Organization.findById(req.user.organizationId);
    const acceptUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?inviteCode=${encodeURIComponent(code)}`;

    await sendInvitationEmail({
      to: email,
      code,
      role: inviteToken.role,
      level: inviteToken.level,
      organizationName: organization?.name || 'your organization',
      acceptUrl,
    });

    await logAuditEvent({
      userId: req.user._id,
      userName: req.user.name,
      organizationId: req.user.organizationId,
      action: 'INVITE_EMAIL_SENT',
      ipAddress: req.ip,
      details: `Sent invite code ${code} to ${email}`,
    });

    res.json({ message: 'Invitation email sent successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/invites
export const getInviteTokens = async (req, res, next) => {
  try {
    const invites = await InviteToken.find({ organizationId: req.user.organizationId })
      .select('code role level recipientEmail isUsed expiresAt createdAt')
      .sort({ createdAt: -1 });
    res.json(invites);
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
