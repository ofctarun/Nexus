import { Router } from 'express';
import { getOrganization } from '../controllers/orgController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getOrganization);

export default router;
