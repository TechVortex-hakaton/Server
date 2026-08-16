import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';
import { slugify } from '../utils/slugify';

type ArticleInput = {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  image?: string;
  categoryId?: string | null;
  isPublished?: boolean;
};

export const listArticles = () => {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
};

export const getArticleBySlug = async (slug: string) => {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article || !article.isPublished) {
    throw new AppError(404, 'Article not found');
  }
  return article;
};

export const adminListArticles = () => {
  return prisma.article.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true } });
};

export const adminCreateArticle = (authorId: string, data: ArticleInput) => {
  return prisma.article.create({
    data: { ...data, authorId, slug: data.slug ?? slugify(data.title) },
  });
};

export const adminUpdateArticle = async (id: string, data: Partial<ArticleInput>) => {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new AppError(404, 'Article not found');
  }
  return prisma.article.update({ where: { id }, data });
};

export const adminDeleteArticle = async (id: string) => {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new AppError(404, 'Article not found');
  }
  await prisma.article.delete({ where: { id } });
};
