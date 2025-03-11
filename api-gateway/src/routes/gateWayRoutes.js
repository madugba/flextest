import express from 'express';
import { HttpStatusCode } from 'axios';
import ProxyService from '../services/proxyService.js';
import logger from '../config/loghandler.js';

const router = express.Router();

const proxy = new ProxyService();

router.use('/v1/api/admin', (req, res, next) => {
    logger.info(`Received request for /v1/api/admin: ${req.method} ${req.url}`);
    proxy.handleRequest('admin-server')(req, res, next);
});

router.use((err, req, res, next) => {
    if (err.code === 'ECONNABORTED' || err.message === 'request aborted') {
        logger.error(`Request aborted: ${err.message}`);
        res.status(HttpStatusCode.BadRequest).json({ error: 'Request aborted by the client' });
    } else {
        next(err);
    }
});

export default router;