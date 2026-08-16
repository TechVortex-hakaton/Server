import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';

export const listNotifications = (userId: string) => {
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const markNotificationRead = async (userId: string, id: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw new AppError(404, 'Notification not found');
  }
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const createNotification = (userId: string, title: string, message: string) => {
  return prisma.notification.create({ data: { userId, title, message } });
};
