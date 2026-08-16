import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);

export default router;
