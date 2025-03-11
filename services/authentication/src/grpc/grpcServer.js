import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { AppError } from "@flextest/apperrorhandler";
import { HttpStatusCode } from "axios";
import path from "path";
import grpcHandlers from "./handlers/grpcHandlers.js";
import logger from "../config/logghandler.js";
import protoPath from "@flextest/proto-files";

const config = {
  AuthService: {
    port: process.env.ADMIN_GRPC_SERVICE_PORT || 50052,
    serviceName: "AuthService",
    protoFile: protoPath.auth,
  },
};

const startGrpcServer = async () =>{
  const protoPath = path.resolve(config.AuthService.protoFile);
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  const adminProto = grpc.loadPackageDefinition(packageDefinition);

  const grpcServer = new grpc.Server();
  grpcServer.addService(adminProto[config.AuthService.serviceName].service, grpcHandlers);

  grpcServer.bindAsync(`0.0.0.0:${config.AuthService.port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      logger.error(`Failed to bind server: ${err.message}`);
      throw new AppError(HttpStatusCode.InternalServerError, "Failed to bind gRPC server");
    }
    logger.info(`${config.AuthService.serviceName} gRPC Server running on port ${bindPort}`);
  });

  return grpcServer;
}

export default startGrpcServer;
