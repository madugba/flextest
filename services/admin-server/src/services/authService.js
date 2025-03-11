import callAuthClient from '../config/grpc_client.js';
import { AppError } from '@flextest/apperrorhandler';
import { HttpStatusCode } from 'axios';

class AuthService {
  constructor(grpcClient = callAuthClient) {
    this.callGrpcClient = grpcClient;
  }

  async #callGrpcClient(method, data) {
    try {
      const response = await this.callGrpcClient(method, data);
      return response;
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, error.message);
    }
  }

  async register(data) {
    return this.#callGrpcClient('CreateUser', data);
  }

  async login(email, password) {
    return this.#callGrpcClient('LoginUser', { email, password });
  }

  async generateLoginToken(userId) {
    return this.#callGrpcClient('CreateLoginToken', { userId });
  }

  async verifyLoginToken(token, userId) {
    return this.#callGrpcClient('VerifyLoginToken', { token, userId });
  }
}

export default AuthService;