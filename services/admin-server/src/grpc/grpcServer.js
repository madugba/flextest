import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import grpcHandlers from "./handler/grpcHandlers.js";
import { AppError } from "@flextest/apperrorhandler";
import { HttpStatusCode } from "axios";
import logger from "../config/logghandler.js";
import protoPath from "@flextest/proto-files";

const config = {
  AdminService: {
    port: process.env.ADMIN_GRPC_SERVICE_PORT || 50051,
    serviceName: "AdminService",
    protoFile: protoPath.admin,
  },
};



const startGrpcServer = async () =>{
  const protoPath = path.resolve(config.AdminService.protoFile);
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  const adminProto = grpc.loadPackageDefinition(packageDefinition);

  const grpcServer = new grpc.Server();
  grpcServer.addService(adminProto[config.AdminService.serviceName].service, grpcHandlers);

  grpcServer.bindAsync(`0.0.0.0:${config.AdminService.port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      logger.error(`Failed to bind server: ${err.message}`);
      throw new AppError(HttpStatusCode.InternalServerError, "Failed to bind gRPC server");
    }
    logger.info(`${config.AdminService.serviceName} gRPC Server running on port ${bindPort}`);
  });

  return grpcServer;
}

export default startGrpcServer;
