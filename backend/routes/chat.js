import express from 'express';
import ChatSession from '../models/ChatSession.js';
import { protect } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/message', protect, auditLog('Send Chat Message'), async (req, res) => {
  try {
    const { session_id, message } = req.body;
    let session = await ChatSession.findOne({ session_id, user: req.user._id });
    
    if (!session) {
      session = await ChatSession.create({
        session_id,
        user: req.user._id,
        organization: req.user.organization,
        title: message.substring(0, 30) + '...',
        messages: []
      });
    }

    session.messages.push({ role: 'user', content: message });
    
    // Placeholder for ML service call
    const mockReply = `Received your message: "${message}". The ML service is currently offline.`;
    session.messages.push({ role: 'assistant', content: mockReply });
    
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/sessions/:id', protect, auditLog('Delete Chat Session'), async (req, res) => {
  try {
    await ChatSession.findOneAndDelete({ session_id: req.params.id, user: req.user._id });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
