import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.get('/', categoryController.getCategories);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(authMiddleware, adminMiddleware);
adminCategoryRouter.post('/', validate(createCategorySchema), categoryController.adminCreateCategory);
adminCategoryRouter.put('/:id', validate(idParamSchema, 'params'), validate(updateCategorySchema), categoryController.adminUpdateCategory);
adminCategoryRouter.delete('/:id', validate(idParamSchema, 'params'), categoryController.adminDeleteCategory);

export default router;
