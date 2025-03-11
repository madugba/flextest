import 'dotenv/config';


const PORT = process.env.PORT;
const REDIS_URL = process.env.REDIS_URL;
const MAX_RATELIMIT = process.env.MAX_RATELIMIT;
const PROD_HOST = process.env.PROD_HOST;
const DEV_HOST = process.env.DEV_HOST;
const CONSUL_HOST = process.env.CONSUL_HOST;
const CONSUL_PORT = process.env.CONSUL_PORT;
const SERVICE_NAME = process.env.SERVICE_NAME;


export {
    PORT,
    REDIS_URL,
    MAX_RATELIMIT,
    DEV_HOST,
    PROD_HOST,
    CONSUL_HOST,
    CONSUL_PORT,
    SERVICE_NAME
}