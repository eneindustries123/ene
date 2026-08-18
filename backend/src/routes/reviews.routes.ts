import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller';
import { requireAdminAuth } from '../middleware/auth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

export const reviewsRouter = Router();

// Public routes
reviewsRouter.get('/approved', ReviewsController.getApproved);
reviewsRouter.post('/submit', publicApiRateLimiter, ReviewsController.submit);

// Protected Admin routes
reviewsRouter.get('/', requireAdminAuth, ReviewsController.getAll);
reviewsRouter.patch('/:id', requireAdminAuth, ReviewsController.updateStatus);
reviewsRouter.put('/:id', requireAdminAuth, ReviewsController.updateStatus);
reviewsRouter.delete('/:id', requireAdminAuth, ReviewsController.delete);
