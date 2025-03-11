import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import gatewayRoutes from './src/routes/gateWayRoutes.js';
import rateLimits from './src/middleware/rateLimit/rateLimit.js';
import errorHandler from './src/config/errorHandler.js';

const app = express();
app.use(helmet());
app.use(rateLimits);
app.use(gatewayRoutes);
app.use(errorHandler);

export default app;