import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { AppError } from "@flextest/apperrorhandler";
import logger from "./logghandler.js";
import { HttpStatusCode } from "axios";
import protoPath from "@flextest/proto-files";

const config = {
    AuthService: {
        host: process.env.AUTH_GRPC_SERVICE_HOST || "authentication",
        port: process.env.AUTH_GRPC_SERVICE_PORT || 50052,
        protoPath: protoPath.auth,
        serviceName: "AuthService",
    },
};

async function createGrpcClient(serviceConfig) {
    try {
        const { protoPath, serviceName, host, port } = serviceConfig;

        // Resolve absolute proto file path
        const resolvedProtoPath = path.resolve(protoPath);
        const packageDefinition = await protoLoader.load(resolvedProtoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        // Load gRPC package definition
        const proto = grpc.loadPackageDefinition(packageDefinition);

        // Ensure the service exists
        if (!proto[serviceName]) {
            throw new AppError(
                HttpStatusCode.InternalServerError,
                `Service ${serviceName} not found in proto definition`
            );
        }

        const ServiceClass = proto[serviceName]; // Get the gRPC service class
        if (typeof ServiceClass !== "function") {
            throw new AppError(
                HttpStatusCode.InternalServerError,
                `${serviceName} is not a valid gRPC service`
            );
        }

        // Create and return the gRPC client
        return new ServiceClass(`${host}:${port}`, grpc.credentials.createInsecure());
    } catch (error) {
        logger.error(`Failed to create gRPC client for ${serviceConfig.serviceName}:`, error);
        throw new AppError(
            HttpStatusCode.InternalServerError,
            `Failed to create gRPC client for ${serviceConfig.serviceName}`
        );
    }
}

async function initializeGrpcClients() {
    const clients = {};

    for (const [serviceName, serviceConfig] of Object.entries(config)) {
        try {
            clients[serviceName] = await createGrpcClient(serviceConfig);
            logger.info(`${serviceName} gRPC client initialized successfully`);
        } catch (error) {
            logger.error(`Failed to initialize ${serviceName} gRPC client:`, error);
        }
    }

    return clients;
}

// Initialize and export gRPC clients
const grpcClients = await initializeGrpcClients();
export const { AuthService: authClient } = grpcClients;
