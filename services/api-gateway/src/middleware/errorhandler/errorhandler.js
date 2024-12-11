import { HttpStatusCode } from 'axios';

import AppError from './apperror.js';
import logger from "../logghandler/logghandler.js";

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