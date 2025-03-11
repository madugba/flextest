import Consul from "consul";
import { createInternalServerError } from  "@flextest/apperrorhandler"
import logger from "./logghandler.js";
import os from 'os';

const consul = new Consul({
  host: "consul",
  port: 8500,
});

const serviceId = `authentication-${os.hostname()}`;
const serviceAddress = 'authentication';
const servicePort  = 3002;

const registerService = async () => {
  
  consul.agent.service.register(
      {
        id: serviceId,
        name: 'authentication',
        address: serviceAddress,
        port: servicePort,
        check: {
          http: `http://authentication:${process.env.AUTH_SERVICE_PORT || 3002}/health`, // Health check endpoint
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
