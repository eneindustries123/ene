import { Router } from 'express';
import { QuotesController } from '../controllers/quotes.controller';
import { requireAdminAuth } from '../middleware/auth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

export const quotesRouter = Router();

quotesRouter.post('/', publicApiRateLimiter, QuotesController.submit);
quotesRouter.get('/', requireAdminAuth, QuotesController.getAll);
