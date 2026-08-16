import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import { AppError } from './utils/apiResponse';
import apiRouter from './routes';

const app = express();

const allowedOrigins = env.CLIENT_URL.split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'OK', data: { uptime: process.uptime() } });
});

app.use('/api', apiRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'Route not found'));
});

app.use(errorMiddleware);

export default app;
