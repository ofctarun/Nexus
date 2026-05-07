import { Router } from 'express';
import { getStats, getUsers, changeUserRole, deactivateUser, getAdminDocuments, adminDeleteDocument } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';

const router = Router();

router.use(auth);
router.use(rbac(['admin'])); // ALL admin routes require admin role

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', changeUserRole);
router.patch('/users/:id/deactivate', deactivateUser);
router.get('/documents', getAdminDocuments);
router.delete('/documents/:id', adminDeleteDocument);

export default router;
