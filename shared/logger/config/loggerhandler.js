import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, format, transports } from 'winston';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createLoggerWithPath = (customLogDir = null) => {
  // Default log directory is outside of node_modules
  const defaultLogDir = path.join(__dirname, '../../logs');

  const logDir = customLogDir
    ? path.isAbsolute(customLogDir)
      ? customLogDir
      : path.join(process.cwd(), customLogDir)
    : defaultLogDir;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true, mode: 0o777 });
  }

  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, stack, method, url }) => {
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (stack) logMessage += `\n${stack}`;
        if (method) logMessage += ` [${method}]`;
        if (url) logMessage += ` ${url}`;
        return logMessage;
      }),
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: path.join(logDir, 'combined.log'),
        maxsize: 5242880,
        maxFiles: 5,
        tailable: true,
      }),
      new transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5242880,
        maxFiles: 5,
        tailable: true,
      }),
    ],
    exceptionHandlers: [
      new transports.File({
        filename: path.join(logDir, 'exceptions.log'),
        maxsize: 5242880,
        maxFiles: 5,
        tailable: true,
      }),
    ],
    rejectionHandlers: [
      new transports.File({
        filename: path.join(logDir, 'rejections.log'),
        maxsize: 5242880,
        maxFiles: 5,
        tailable: true,
      }),
    ],
    exitOnError: false,
  });
};

export default createLoggerWithPath;