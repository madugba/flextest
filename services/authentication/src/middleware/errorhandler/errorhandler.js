import { HttpStatusCode } from 'axios';
import { AppError } from '@flextest/apperrorhandler';
import logger from "../../config/logghandler.js";


export const serverErrorHandler = (port) => (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const errorHandler = (err, request, response, next) => {

    logger.error(`Error: ${err.message}`, {
      stack: err.stack,
      url: request.originalUrl,
      method: request.method,
      body: request.body,
      params: request.params,
      query: request.query,
    });
  
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
        errorCode: err.errorCode,
        isOperational: err.isOperational,
        timestamp: err.timestamp,
      });
    }
  
    const statusCode = err.statusCode || HttpStatusCode.InternalServerError;
    const message = statusCode === HttpStatusCode.InternalServerError
      ? 'Server is currently down. Please try again later.'
      : 'Request is invalid.';
  
    response.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      errorCode: err.errorCode || 'UNKNOWN_ERROR',
      timestamp: err.timestamp,
    });
    next();
  };
  
  export default errorHandler;