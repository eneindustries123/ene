import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { authRouter } from './routes/auth.routes';
import { projectsRouter } from './routes/projects.routes';
import { reviewsRouter } from './routes/reviews.routes';
import { enquiriesRouter } from './routes/enquiries.routes';
import { quotesRouter } from './routes/quotes.routes';
import { uploadsRouter } from './routes/uploads.routes';
import { errorHandler } from './middleware/error';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const CORS_ORIGIN = process.env.CORS_ORIGIN || FRONTEND_URL;

// Security & Parsing Middlewares
app.use(helmet());

const allowedOrigins = [
  FRONTEND_URL,
  CORS_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.eneindustries.com') ||
        origin.endsWith('.belmo.app') ||
        origin.endsWith('.belmo.io')
      ) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ene-industries-backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/quote-requests', quotesRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/uploads', uploadsRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E&E Industries API running on port ${PORT}`);
    console.log(`Allowed Frontend Origin: ${FRONTEND_URL}`);
  });
}

export default app;
