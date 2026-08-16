import { Router } from 'express';
import * as sportController from '../controllers/sport.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { createSportSchema, updateSportSchema } from '../validators/sport.validator';

const router = Router();

router.get('/', sportController.getSports);
router.get('/:id', validate(idParamSchema, 'params'), sportController.getSportById);

export const adminSportRouter = Router();
adminSportRouter.use(authMiddleware, adminMiddleware);
adminSportRouter.get('/', sportController.adminListSports);
adminSportRouter.post('/', validate(createSportSchema), sportController.adminCreateSport);
adminSportRouter.put('/:id', validate(idParamSchema, 'params'), validate(updateSportSchema), sportController.adminUpdateSport);
adminSportRouter.delete('/:id', validate(idParamSchema, 'params'), sportController.adminDeleteSport);

export default router;
