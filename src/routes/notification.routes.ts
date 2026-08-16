import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

router.use(authMiddleware);
router.get('/', notificationController.getNotifications);
router.put('/:id/read', validate(idParamSchema, 'params'), notificationController.markRead);

export default router;
