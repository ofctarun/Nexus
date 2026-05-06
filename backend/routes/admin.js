import express from 'express';
import User from '../models/User.js';
import Document from '../models/Document.js';
import AuditLog from '../models/AuditLog.js';
import { protect, authorize } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

router.get('/stats', protect, authorize('Admin'), async (req, res) => {
  try {
    const orgId = req.user.organization;
    const usersCount = await User.countDocuments({ organization: orgId });
    const docsCount = await Document.countDocuments({ organization: orgId });
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const queriesCount = await AuditLog.countDocuments({ 
      organization: orgId, 
      action: 'Send Chat Message',
      createdAt: { $gte: today }
    });

    res.json({ usersCount, docsCount, queriesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/logs', protect, authorize('Admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find({ organization: req.user.organization })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
