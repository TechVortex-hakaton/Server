import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/apiResponse';

type Source = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, source: Source = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return next(new AppError(400, message));
    }
    req[source] = result.data;
    next();
  };
};
