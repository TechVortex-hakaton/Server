import { Response } from 'express';

export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
