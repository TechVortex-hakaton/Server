import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as authService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  successResponse(res, result, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  successResponse(res, result, 'Login successful');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  successResponse(res, user);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  successResponse(res, null, 'Logged out successfully');
});
