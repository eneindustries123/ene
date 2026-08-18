import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimit';

export const authRouter = Router();

authRouter.post('/login', loginRateLimiter, AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/verify', AuthController.verify);
