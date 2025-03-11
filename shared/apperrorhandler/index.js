import AppError from "./config/apperror.js";
import { HttpStatusCode } from "axios";

export const createBadRequestError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.BadRequest, message, true, '', errorCode);
};

export const createUnauthorizedError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.Unauthorized, message, true, '', errorCode);
};

export const createForbiddenError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.Forbidden, message, true, '', errorCode);
};

export const createNotFoundError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.NotFound, message, true, '', errorCode);
};

export const createConflictError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.Conflict, message, true, '', errorCode);
};

export const createInternalServerError = (message, errorCode = '') => {
  return new AppError(HttpStatusCode.InternalServerError, message, false, '', errorCode);
};

// Global error handler middleware for Express
export const errorHandler = (err, res, next) => {
  // If the error is an instance of AppError, send the formatted response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  next(err);
};

export { AppError };
