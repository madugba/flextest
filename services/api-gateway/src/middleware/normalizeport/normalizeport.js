import { PORT } from "../../config/envconfig.js";

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const GATEWAY_PORT = normalizePort(PORT || '3000');

export default GATEWAY_PORT;