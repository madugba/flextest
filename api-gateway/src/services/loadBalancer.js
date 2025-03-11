import { HttpStatusCode } from "axios";
import { AppError } from "@flextest/apperrorhandler";
import redis from "../config/redis.js";


class LoadBalancer {
    constructor() {
        this.redis = redis;
    }

    //select the next service instance using round-robin strategy
    async getNextInstance(serviceName, serviceInstances) {
        try{
            let instances = await this.redis.getServiceInstances(`loadBalancer:${serviceName}`);
            if(!instances) this.redis.cacheServiceInstances(`loadBalancer:${serviceName}`, {index: 0, instance: serviceInstances});

            const {index, instance } = await this.redis.getServiceInstances(`loadBalancer:${serviceName}`);

            const nextIndex = (index + 1) % instance.length; // round-robin logic

            this.redis.cacheServiceInstances(`loadBalancer:${serviceName}`, {index: nextIndex, instance});
            
            return instance[nextIndex];
        }catch(error) {
            throw new AppError(HttpStatusCode.InternalServerError, error);
        }
    }
}

export default LoadBalancer;

