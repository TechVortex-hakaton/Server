import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';

export const listSports = () => {
  return prisma.sport.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });
};

export const getSportById = async (id: string) => {
  const sport = await prisma.sport.findUnique({ where: { id } });
  if (!sport) {
    throw new AppError(404, 'Sport not found');
  }
  return sport;
};

type SportInput = {
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  difficulty?: string;
  calories?: number;
  image?: string;
  isActive?: boolean;
};

export const adminListSports = () => {
  return prisma.sport.findMany({ orderBy: { createdAt: 'asc' } });
};

export const adminCreateSport = (data: SportInput) => {
  return prisma.sport.create({ data });
};

export const adminUpdateSport = async (id: string, data: Partial<SportInput>) => {
  const sport = await prisma.sport.findUnique({ where: { id } });
  if (!sport) {
    throw new AppError(404, 'Sport not found');
  }
  return prisma.sport.update({ where: { id }, data });
};

export const adminDeleteSport = async (id: string) => {
  const sport = await prisma.sport.findUnique({ where: { id } });
  if (!sport) {
    throw new AppError(404, 'Sport not found');
  }
  await prisma.sport.delete({ where: { id } });
};
