import { HttpStatusCode } from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';

import errorHandler from './middlewares/errorhandler/errorhandler.js';
import authRoute from './routes/authRoutes.js';
// import userRoute from './routes/userRoutes.js';
// import subjectRoute from './routes/subjectRoutes.js';

import { registerService } from "./config/consul.js";
import startGrpcServer from './grpc/grpcServer.js';


const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


await registerService(); 
await startGrpcServer();


app.get('/health', (request, response) => {
  response.status(HttpStatusCode.Ok).json({ status: 'OK' });
});

app.use('/auth', authRoute);
// app.use('/user', userRoute);
// app.use('/subject', subjectRoute);


app.use(errorHandler);

export default app;
