import express from 'express';
import AuthController from '../controllers/authController.js';
import { loginRateLimit } from '../middlewares/rateLimit/ratelimit.js';

const router = express.Router();

const authController = new AuthController();

// Route configuration
const routes = [
    {
        method: 'post',
        path: '/register',
        handler: (req, res, next) => authController.register(req, res, next),
    },
    {
        method: 'post',
        path: '/login',
        handler: (req, res, next) => authController.login(req, res, next),
        middlewares: [loginRateLimit],
    },
    {
        method: 'post',
        path: '/password/forgot',
        handler: (req, res, next) => authController.forgotPassword(req, res, next),
    },
    {
        method: 'post',
        path: '/otp/verify',
        handler: (req, res, next) => authController.verifyOTP(req, res, next),
        middlewares: [loginRateLimit],
    },
    {
        method: 'patch',
        path: '/password/change/external',
        handler: (req, res, next) => authController.changePasswordExternal(req, res, next),
    },
];

// Register routes
routes.forEach(({ method, path, handler, middlewares = [] }) => {
    router[method](path, ...middlewares, handler);
});

export default router;