import app from './app';
import { env } from './config/env';
import { prisma, disconnectPrisma } from './config/prisma';

const start = async () => {
  await prisma.$connect();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectPrisma();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
