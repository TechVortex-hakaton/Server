import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as notificationService from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.listNotifications(req.user!.id);
  successResponse(res, notifications);
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markNotificationRead(req.user!.id, req.params.id);
  successResponse(res, notification, 'Notification marked as read');
});
