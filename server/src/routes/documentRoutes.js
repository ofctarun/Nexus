import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController.js';
import { auth } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(auth);

router.get('/', getDocuments); // All roles — filtered by permission level
router.post('/upload', rbac(['admin', 'member']), upload.single('file'), uploadDocument);
router.delete('/:id', rbac(['admin', 'member']), deleteDocument);

export default router;
