import 'dotenv/config';


const PORT = process.env.PORT;
const CONSUL_PORT = process.env.CONSUL_PORT
const CONSUL_HOST = process.env.CONSUL_HOST

export {
    PORT,
    CONSUL_HOST,
    CONSUL_PORT
}