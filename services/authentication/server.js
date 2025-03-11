import { createServer } from "http";
import app from "./src/app.js"; 
import AUTH_SERVICE_PORT from "./src/config/normalizeport.js";
import { serverErrorHandler } from "./src/middleware/errorhandler/errorhandler.js";
import logger from "./src/config/logghandler.js";


const PORT = AUTH_SERVICE_PORT;

app.set("port", PORT);

const server = createServer(app);

server.on("error", serverErrorHandler);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? `pipe ${address}` : `port ${PORT}`;
  logger.info(`Server is listening on ${bind}`);
});

const shutdown = () => {
  logger.info("Received shutdown signal, closing server...");

  server.close(() => {
    logger.info("Server closed successfully. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Server did not close in time, forcing exit.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    logger.info(`Attempting to bind server on port ${PORT}`);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();