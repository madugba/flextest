class AppError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '', errorCode = '') {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.errorCode = errorCode;
      this.timestamp = new Date().toISOString();
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
    toJSON() {
      return {
        message: this.message,
        statusCode: this.statusCode,
        isOperational: this.isOperational,
        errorCode: this.errorCode,
        timestamp: this.timestamp,
        stack: this.stack,
      };
    }
  }
  
  export default AppError;