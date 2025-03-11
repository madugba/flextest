import redis from "../config/redis.js";

class CircuitBreaker {
    constructor(failureThreshold = 5, timeout = 30) {
        this.redis  = redis;
        this.failureThreshold = failureThreshold;
        this.timeout = timeout
    }

    async setState(serviceName, isOpen){
        await this.redis.set(`circuit:${serviceName}`, isOpen ? 'open' : 'closed', this.timeout);
    }

    async getState(serviceName) {
        const state = await this.redis.get(`circuit:${serviceName}`);
        return state === 'open';
    }

    async recordFailure(serviceName) {
        let failure = await this.redis.get(`failures:${serviceName}`);

        const failureCount = failure ? parseInt(failure) : 0;

        if(failureCount >= this.failureThreshold){
            await this.setState(serviceName, true);
        }else{
            await this.redis.set(`failures:${serviceName}`, parseInt(failure) + 1, this.timeout)
        }
    }

    async resetFailures(serviceName) {
        await this.redis.delete(`failures:${serviceName}`);
    }
}

export default CircuitBreaker;
