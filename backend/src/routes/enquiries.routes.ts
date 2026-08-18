import { Router } from 'express';
import { EnquiriesController } from '../controllers/enquiries.controller';
import { requireAdminAuth } from '../middleware/auth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

export const enquiriesRouter = Router();

enquiriesRouter.post('/', publicApiRateLimiter, EnquiriesController.submit);
enquiriesRouter.get('/', requireAdminAuth, EnquiriesController.getAll);
