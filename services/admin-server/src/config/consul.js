import Consul from "consul";
import { PORT } from "./envconfig.js";
import { createInternalServerError } from "@flextest/apperrorhandler";
import logger from "./logghandler.js";
import os from 'os';

const consul = new Consul({
  host: "consul",
  port: 8500,
});

const serviceId = `admin-server-${os.hostname()}`;
const serviceAddress = 'admin-server';
const servicePort  = 3001;

const registerService = async () => {
  
  consul.agent.service.register(
      {
        id: serviceId,
        name: 'admin-server',
        address: serviceAddress,
        port: servicePort,
        check: {
          http: `http://admin-server:${PORT || 3001}/health`, // Health check endpoint
          interval: '30s', 
          timeout: '5s',
          deregistercriticalserviceafter: '1m'
        },
      },
      (err) => {
        createInternalServerError(`Service registration failed ${err}`);
      }
    );
};




process.on("SIGINT", async () => {
  try {
    await consul.agent.service.deregister(serviceId);
    logger.info(`Service ${serviceId} deregistered from Consul.`);
    process.exit(0);
  } catch (err) {
    logger.error("Error during service deregistration:", err);
    process.exit(1);
  }
});

export {consul, registerService };
