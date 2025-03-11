import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppError } from '@flextest/apperrorhandler';
import { errorHandler } from '@flextest/apperrorhandler';
import { HttpStatusCode } from 'axios';

import redis from '../config/redis.js';
import CircuitBreaker from './circuitBreaker.js';
import LoadBalancer from './loadBalancer.js';   
import ConsulService from './consulService.js';
import logger from '../config/loghandler.js';

class ProxyService {
    constructor(failureThreshold = 5, timeout = 30) {
        this.redis = redis;
        this.circuitBreaker = new CircuitBreaker(failureThreshold, timeout);
        this.loadBalancer = new LoadBalancer();
        this.consulService = new ConsulService();
        this.proxies = {}; // Cache for proxy middlewares
    }

    async createDynamicProxy(serviceName) {
        if (!this.proxies[serviceName]) {
            const isCircuitOpen = await this.circuitBreaker.getState(serviceName);
            if (isCircuitOpen) throw new AppError(HttpStatusCode.ServiceUnavailable, 'Service temporarily unavailable');

            let serviceInstances = await this.redis.getServiceInstances(serviceName);
            if (!serviceInstances) {
                serviceInstances = await this.consulService.getServiceInstances(serviceName);
                await this.redis.cacheServiceInstances(serviceName, serviceInstances);
            }

            const instance = await this.loadBalancer.getNextInstance(serviceName, serviceInstances);
            const targetUrl = `http://${instance.address}:${instance.port}`;
            logger.info(`Proxying request to ${serviceName} at ${targetUrl}`);
            this.proxies[serviceName] = createProxyMiddleware({ target: targetUrl, changeOrigin: true });
        }

        return this.proxies[serviceName];
    }

    handleRequest(serviceName) {
        return async (request, response, next) => {
            try {
                const proxy = await this.createDynamicProxy(serviceName);
                proxy(request, response, next);
            } catch (error) {
                logger.error(`Error accessing service ${serviceName}: ${error}`);
                await this.circuitBreaker.recordFailure(serviceName);
                errorHandler(error, response, next);
            }
        };
    }
}

export default ProxyService;