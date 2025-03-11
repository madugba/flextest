import { HttpStatusCode } from 'axios';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import errorHandler from './middleware/errorhandler/errorhandler.js';
import startGrpcServer from './grpc/grpcServer.js';

import { registerService } from "./config/consul.js";

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


await registerService(); 
await startGrpcServer();

app.get('/health', (request, response) => {
  response.status(HttpStatusCode.Ok).json({ status: 'OK' });
});

app.use(errorHandler);

export default app;
