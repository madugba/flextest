import 'dotenv/config';


const PORT = process.env.PORT;
const CONSUL_PORT = process.env.CONSUL_PORT
const CONSUL_HOST = process.env.CONSUL_HOST
const REDIS_URL = process.env.REDIS_URL
const MAX_RATELIMIT = process.env.MAX_RATELIMIT

export {
    PORT,
    CONSUL_HOST,
    CONSUL_PORT,
    REDIS_URL,
    MAX_RATELIMIT
}