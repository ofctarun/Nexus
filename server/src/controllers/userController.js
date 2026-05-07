import User from '../models/User.js';
import { logAuditEvent } from '../middleware/audit.js';

// GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true });

    await logAuditEvent({
      userId: user._id, userName: user.name, organizationId: user.organizationId,
      action: 'PROFILE_UPDATED', ipAddress: req.ip,
    });

    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    await logAuditEvent({
      userId: user._id, userName: user.name, organizationId: user.organizationId,
      action: 'PASSWORD_CHANGED', ipAddress: req.ip,
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/account
export const deleteAccount = async (req, res, next) => {
  try {
    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'ACCOUNT_DELETED', ipAddress: req.ip,
    });

    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
