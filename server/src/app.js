import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orgRoutes from './routes/orgRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import configRoutes from './routes/configRoutes.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust proxy (required for Render/Vercel to handle cookies correctly)
app.set('trust proxy', 1);

// ─── Global Middleware ─────────────────────
// CORS: allow the local dev client, and the Vercel app in production
const allowedOrigins = [process.env.CLIENT_URL, 'https://nexus40.vercel.app'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser requests (e.g. Postman) and allow all in development
    if (!origin || process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
}));

// Origin-aware middleware: set backend/client base URLs depending on request origin
app.use((req, res, next) => {
  const origin = req.get('origin') || '';
  if (origin.includes('nexus40.vercel.app')) {
    req.backendBaseUrl = 'https://nexus-h82b.onrender.com';
    req.clientBaseUrl = 'https://nexus40.vercel.app';
  } else {
    req.backendBaseUrl = `http://localhost:${process.env.PORT || 5000}`;
    req.clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  }
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── API Routes ────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/config', configRoutes);

// ─── Health Check ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ─────────────────────────
app.use(errorHandler);

export default app;
