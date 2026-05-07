import { Router } from 'express';
import { getLogs } from '../controllers/auditController.js';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';

const router = Router();

router.use(auth);
router.use(rbac(['admin']));

router.get('/logs', getLogs);

export default router;
