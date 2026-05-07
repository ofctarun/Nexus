import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, deleteAccount } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth); // All user routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

export default router;
