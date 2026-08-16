import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { createArticleSchema, updateArticleSchema } from '../validators/article.validator';

const router = Router();

router.get('/', articleController.getArticles);
router.get('/:slug', articleController.getArticleBySlug);

export const adminArticleRouter = Router();
adminArticleRouter.use(authMiddleware, adminMiddleware);
adminArticleRouter.get('/', articleController.adminListArticles);
adminArticleRouter.post('/', validate(createArticleSchema), articleController.adminCreateArticle);
adminArticleRouter.put('/:id', validate(idParamSchema, 'params'), validate(updateArticleSchema), articleController.adminUpdateArticle);
adminArticleRouter.delete('/:id', validate(idParamSchema, 'params'), articleController.adminDeleteArticle);

export default router;
