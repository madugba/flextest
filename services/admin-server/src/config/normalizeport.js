
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

const ADMIN_SERVER_PORT = normalizePort(process.env.ADMIN_SERVICE_PORT || 3001);

export default ADMIN_SERVER_PORT;