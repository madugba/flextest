import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Consul from 'consul';
import {CONSUL_PORT, CONSUL_HOST} from './src/config/envconfig.js';
import GATEWAY_PORT from './src/middleware/normalizeport/normalizeport.js';
import handleError from './src/middleware/helper/handleError.helper.js';
import AppError from './src/middleware/errorhandler/apperror.js';
import { HttpStatusCode } from 'axios';
import ERROR_MESSAGES from './src/middleware/helper/ERROR_MESSAGE.js';
import logger from './src/middleware/logghandler/logghandler.js';


const app = express();

const consul = new Consul({
  host: CONSUL_HOST || 'localhost',
  port: CONSUL_PORT,
});

const cache = new Map();

const getServiceUrl = async (serviceName) => {
  if (cache.has(serviceName)) {
    return cache.get(serviceName);
  }
  const result = await consul.health.service(serviceName);
  const healthyNodes = result.filter(
    (node) => node.Checks.every((check) => check.Status === 'passing')
  );
  if (healthyNodes.length > 0) {
    const service = healthyNodes[0].Service;
    const url = `http://${service.Address}:${service.Port}`;
    cache.set(serviceName, url);
    setTimeout(() => cache.delete(serviceName), 60000); // TTL of 1 minute
    return url;
  }
  throw new AppError(HttpStatusCode.NotFound, `${ERROR_MESSAGES.GATE_WAY_ERROR} ${serviceName}`);
};

const createDynamicProxy = (serviceName) => {
  return async (request, response, next) => {
    try {
      const target = await getServiceUrl(serviceName);
      createProxyMiddleware({ target, changeOrigin: true })(request, response, next);
    } catch (error) {
      logger.error(`Error accessing service ${serviceName}: ${error.message}`);
      handleError(error, response, next);
    }
  };
};

app.use('/v1/api/admin', createDynamicProxy('adminbackend-management'));
app.use('/v1/api/candidate', createDynamicProxy('candidate-managment'));


app.listen(GATEWAY_PORT, () => {
  logger.info(`API Gateway running on port ${GATEWAY_PORT}`);
});

process.on('SIGINT', () => {
  logger.info('Shutting down API Gateway...');
  process.exit();
});
