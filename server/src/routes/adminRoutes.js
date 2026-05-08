import { Router } from 'express';
import { getStats, getUsers, changeUserRole, deactivateUser, getAdminDocuments, adminDeleteDocument, createInviteToken, sendInviteEmail, getInviteTokens } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';

const router = Router();

router.use(auth);
router.use(rbac(['admin'])); // ALL admin routes require admin role

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', changeUserRole);
router.patch('/users/:id/deactivate', deactivateUser);
router.post('/invites', createInviteToken);
router.post('/invites/send', sendInviteEmail);
router.get('/invites', getInviteTokens);
router.get('/documents', getAdminDocuments);
router.delete('/documents/:id', adminDeleteDocument);

export default router;
