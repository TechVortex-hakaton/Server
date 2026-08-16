import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as categoryService from '../services/category.service';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  successResponse(res, categories);
});

export const adminCreateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  const category = await categoryService.adminCreateCategory(name, slug);
  successResponse(res, category, 'Category created', 201);
});

export const adminUpdateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.adminUpdateCategory(req.params.id, req.body);
  successResponse(res, category, 'Category updated');
});

export const adminDeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.adminDeleteCategory(req.params.id);
  successResponse(res, null, 'Category deleted');
});
