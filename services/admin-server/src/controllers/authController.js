import { HttpStatusCode } from 'axios';
import { errorHandler } from '@flextest/apperrorhandler';

import AuthService from '../services/authService.js';
import PasswordService from '../services/passwordService.js';
import ValidationService from '../services/validationService.js';
import redis from '../config/redis.js';
import UserService from '../services/userService.js';

class BaseController {
  #validationService;
  #passwordService;
  #authService;
  #userService;

  constructor(validationService, passwordService, authService, userService) {
    this.#validationService = validationService;
    this.#passwordService = passwordService;
    this.#authService = authService;
    this.#userService = userService;
  }

  get validationService() {
    return this.#validationService;
  }

  get passwordService() {
    return this.#passwordService;
  }

  get authService() {
    return this.#authService;
  }

  get userService(){
    return this.#userService;
  }

  async handleRequest(request, response, next, callback) {
    try {
      await callback(request, response);
    } catch (error) {
      errorHandler(error, response, next);
    }
  }
}

class AuthController extends BaseController {
  constructor(
    validation = new ValidationService(),
    passwordService = new PasswordService(),
    authService = new AuthService(),
    userService = new UserService()
  ) {
    super(validation, passwordService, authService, userService);
  }

  async register(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const data = req.body;
      await this.validationService.validateEmail(data.email);
      await this.validationService.validatePassword(data.password);
      const user = await this.authService.register(data);
      res.status(HttpStatusCode.Created).json({ message: 'User registered', user: user.data });
    });
  }

  async login(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const { email, password } = req.body;
      await this.validationService.validateEmail(email);
      const user = await this.authService.login(email, password);
      const userData = user.data;
      await redis.cacheServiceInstances(userData.userId, userData, 600);
      res.status(HttpStatusCode.Ok).json(user);
    });
  }

  async forgotPassword(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const { email } = req.body;
      const { token, userId } = await this.passwordService.requestNewPassword(email);
      res.status(HttpStatusCode.Accepted).json({
        message: 'A One Time Password has been sent to you, expires in 10 minutes',
        token,
        userId,
      });
    });
  }

  async verifyOTP(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const { userId, otp } = req.body;
      const token = req.headers.authorization;
      await this.userService.verifyToken(token, userId);
      const verifToken = await this.passwordService.verifyOTP(userId, otp);
      res.status(HttpStatusCode.Ok).json(verifToken);
    });
  }

  async changePasswordExternal(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const { userId, password } = req.body;
      const token = req.headers.authorization;
      await this.validationService.validatePassword(password);
      await this.userService.verifyToken(token, userId);
      await this.passwordService.changePasswordExternal(userId, password);
      res.status(HttpStatusCode.Ok).json({
        message: 'Password changed successfully',
      });
    });
  }

  async changePasswordInternal(request, response, next) {
    await this.handleRequest(request, response, next, async (req, res) => {
      const user = req.user; // from protect route
      const { userId, newpassword, oldpassword } = req.body;
      await this.validationService.validatePassword(newpassword);
      await this.passwordService.changePasswordInternal(userId, oldpassword, newpassword);
      res.status(HttpStatusCode.Ok).json({
        message: 'Password changed successfully',
        token: user.token,
      });
    });
  }
}

export default AuthController;