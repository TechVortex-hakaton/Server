import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as articleService from '../services/article.service';

export const getArticles = asyncHandler(async (_req: Request, res: Response) => {
  const articles = await articleService.listArticles();
  successResponse(res, articles);
});

export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const article = await articleService.getArticleBySlug(req.params.slug);
  successResponse(res, article);
});

export const adminListArticles = asyncHandler(async (_req: Request, res: Response) => {
  const articles = await articleService.adminListArticles();
  successResponse(res, articles);
});

export const adminCreateArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await articleService.adminCreateArticle(req.user!.id, req.body);
  successResponse(res, article, 'Article created', 201);
});

export const adminUpdateArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await articleService.adminUpdateArticle(req.params.id, req.body);
  successResponse(res, article, 'Article updated');
});

export const adminDeleteArticle = asyncHandler(async (req: Request, res: Response) => {
  await articleService.adminDeleteArticle(req.params.id);
  successResponse(res, null, 'Article deleted');
});
