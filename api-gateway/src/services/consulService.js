import Consul from "consul";
import { HttpStatusCode } from "axios";

import { CONSUL_HOST, CONSUL_PORT } from "../config/envconfig.js";
import { AppError } from "@flextest/apperrorhandler";
import ERROR_MESSAGES from "../utils/helper/ERROR_MESSAGE.js";



class ConsulService {
    constructor() {
        this.consul  = new Consul({
            host: CONSUL_HOST || 'consul',
            port: CONSUL_PORT || 8500,
          });
    }

    async getServiceInstances(serviceName) {
        try {
            if (!serviceName) throw new AppError(HttpStatusCode.BadRequest, 'Service name is required');

            const result = await this.consul.health.service(serviceName);
            const healthyNodes = result.filter(
            (entry) => entry.Checks.every((check) => check.Status === 'passing')
            );

            if (healthyNodes.length > 0) {
                const service = healthyNodes[0].Service;
                return [{
                    address: service.Address,
                    port: service.Port
                }]
            }
            throw new AppError(HttpStatusCode.NotFound, `${ERROR_MESSAGES.GATE_WAY_ERROR} ${serviceName}`);
        }catch(error){
            throw new AppError(HttpStatusCode.InternalServerError, error.message)
        }
    }
}


export default ConsulService;
