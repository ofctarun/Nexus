import express from 'express';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

router.get('/members', protect, auditLog('Get Org Members'), async (req, res) => {
  try {
    const members = await User.find({ organization: req.user.organization }).select('-password');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/role', protect, authorize('Admin'), auditLog('Change Member Role'), async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findOne({ _id: userId, organization: req.user.organization });
    if (!user) return res.status(404).json({ message: 'User not found in this organization' });
    
    user.role = role;
    await user.save();
    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
