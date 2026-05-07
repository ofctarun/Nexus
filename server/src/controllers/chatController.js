import ChatSession from '../models/ChatSession.js';
import { queryRAG } from '../services/mlBridge.js';
import { logAuditEvent } from '../middleware/audit.js';

// GET /api/chat/sessions
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .select('title createdAt')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/sessions/:id
export const getSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.json(session);
  } catch (error) {
    next(error);
  }
};

// POST /api/chat/sessions
export const createSession = async (req, res, next) => {
  try {
    const session = await ChatSession.create({
      userId: req.user._id,
      organizationId: req.user.organizationId,
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// POST /api/chat/sessions/:id/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ message: 'Session not found.' });

    // Add user message
    session.messages.push({ role: 'user', content: message });

    // Build context from last 5 messages
    const recentMessages = session.messages.slice(-5).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Query ML service (Phase 2 — graceful fallback)
    const aiResult = await queryRAG({
      query: message,
      organizationId: req.user.organizationId,
      userRole: req.user.role,
      sessionContext: recentMessages,
    });

    // Add AI response
    session.messages.push({
      role: 'assistant',
      content: aiResult.response,
      sources: aiResult.sources || [],
      fromCache: aiResult.fromCache || false,
    });

    // Auto-generate title from first user message
    if (session.title === 'New Chat' && message.length > 0) {
      session.title = message.slice(0, 60) + (message.length > 60 ? '...' : '');
    }

    await session.save();

    await logAuditEvent({
      userId: req.user._id, userName: req.user.name, organizationId: req.user.organizationId,
      action: 'QUERY_SENT', ipAddress: req.ip, details: message.slice(0, 100),
    });

    res.json({
      response: aiResult.response,
      sources: aiResult.sources || [],
      fromCache: aiResult.fromCache || false,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chat/sessions/:id
export const deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.json({ message: 'Chat session deleted.' });
  } catch (error) {
    next(error);
  }
};
