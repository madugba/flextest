import { status } from "@grpc/grpc-js";
import { AppError } from "@flextest/apperrorhandler";

const handleGrpcError = (error, callback) => {
    const grpcError = {
      code: status.INTERNAL,
      message: error.message,
    };
  
    if (error instanceof AppError) {
      grpcError.code = status.INVALID_ARGUMENT;
    }
    callback(grpcError);
};

export default handleGrpcError;