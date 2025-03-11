
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

const AUTH_SERVICE_PORT = normalizePort(process.env.AUTH_SERVICE_PORT || 3002);

export default AUTH_SERVICE_PORT;