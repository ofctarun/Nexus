import express from 'express';

const router = express.Router();

// GET /api/config
// Returns the backend and client base URLs determined from request origin
router.get('/', (req, res) => {
    res.json({
        backendBaseUrl: req.backendBaseUrl || `http://localhost:${process.env.PORT || 5000}`,
        clientBaseUrl: req.clientBaseUrl || process.env.CLIENT_URL || 'http://localhost:5173',
    });
});

export default router;
