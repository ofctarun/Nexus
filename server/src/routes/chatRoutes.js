import { Router } from 'express';
import { getSessions, getSession, createSession, sendMessage, deleteSession } from '../controllers/chatController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/sessions', getSessions);
router.get('/sessions/:id', getSession);
router.post('/sessions', createSession);
router.post('/sessions/:id/messages', sendMessage);
router.delete('/sessions/:id', deleteSession);

export default router;
