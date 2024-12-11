import AppError from "../errorhandler/apperror.js";

const handleError = (error, response, next) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ message: error.message });
    } else {
      next(error);
    }
  };

 export default handleError;
