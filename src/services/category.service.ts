import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';
import { slugify } from '../utils/slugify';

export const listCategories = () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const adminCreateCategory = (name: string, slug?: string) => {
  return prisma.category.create({
    data: { name, slug: slug ?? slugify(name) },
  });
};

export const adminUpdateCategory = async (
  id: string,
  data: { name?: string; slug?: string }
) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }
  return prisma.category.update({ where: { id }, data });
};

export const adminDeleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }
  await prisma.category.delete({ where: { id } });
};
