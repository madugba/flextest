import cluster from 'cluster';
import os from 'os';

import GATEWAY_PORT from './src/config/normalizeport.js';
import logger from './src/config/loghandler.js';
import app from './app.js';


const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);
  
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {

  app.listen(GATEWAY_PORT, () => {
    logger.info(`Worker process ${process.pid} - API Gateway running on port ${GATEWAY_PORT}`);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down worker process...');
    process.exit();
  });

}
