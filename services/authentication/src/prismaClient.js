
import { PrismaClient } from '@prisma/client';
import logger from './config/logghandler.js';

const prismaSchema = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prismaSchema.$on('warn', (e) => {
  logger.warn(e.message);
});

prismaSchema.$on('error', (e) => {
  logger.error(e.message);
});

export default prismaSchema;
