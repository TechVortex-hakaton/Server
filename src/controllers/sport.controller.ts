import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as sportService from '../services/sport.service';

export const getSports = asyncHandler(async (_req: Request, res: Response) => {
  const sports = await sportService.listSports();
  successResponse(res, sports);
});

export const getSportById = asyncHandler(async (req: Request, res: Response) => {
  const sport = await sportService.getSportById(req.params.id);
  successResponse(res, sport);
});

export const adminListSports = asyncHandler(async (_req: Request, res: Response) => {
  const sports = await sportService.adminListSports();
  successResponse(res, sports);
});

export const adminCreateSport = asyncHandler(async (req: Request, res: Response) => {
  const sport = await sportService.adminCreateSport(req.body);
  successResponse(res, sport, 'Sport created', 201);
});

export const adminUpdateSport = asyncHandler(async (req: Request, res: Response) => {
  const sport = await sportService.adminUpdateSport(req.params.id, req.body);
  successResponse(res, sport, 'Sport updated');
});

export const adminDeleteSport = asyncHandler(async (req: Request, res: Response) => {
  await sportService.adminDeleteSport(req.params.id);
  successResponse(res, null, 'Sport deleted');
});
