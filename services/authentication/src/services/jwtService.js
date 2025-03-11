import jwt from 'jsonwebtoken';
import { HttpStatusCode } from "axios";
import { AppError } from '@flextest/apperrorhandler';

import redis from '../config/redis.js';

class JwtService {
  constructor() {
    this.tokenSecret = process.env.JWT_TOKEN;
    this.redisService = redis
  }

  generateJwtToken(userId, secret, expiresIn) {
    const payload = { id: userId };
    const options = { expiresIn };
    return jwt.sign(payload, secret, options);
  }

 
  async saveRefreshTokenToRedis(userId, refreshToken) {
    try {
      await this.redisService.set(`refreshToken:${userId}`, refreshToken, 24 * 60 * 60);
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, `Error saving refresh token to Redis: ${error.message}`);
    }
  }

  async generateLoginToken(userId) {
    try {
      const refreshTokenExpiry = '1d';
      const loginTokenExpiry = '30m';

      const refreshToken = this.generateJwtToken(userId, this.tokenSecret, refreshTokenExpiry);

      await this.saveRefreshTokenToRedis(userId, refreshToken);

      const loginToken = this.generateJwtToken(userId, this.tokenSecret, loginTokenExpiry);

      return `Bearer ${loginToken}`;
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, `Unable to generate token: ${error.message}`);
    }
  }

  async generateToken(userId) {
    try {

      const TokenExpiry = '20m';

      const token = this.generateJwtToken(userId, this.tokenSecret, TokenExpiry);

      return `Bearer ${token}`;
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, `Unable to generate token: ${error.message}`);
    }
  }

  async validateToken(token) {
    if (!token || token.trim() === '') {
      throw new AppError(HttpStatusCode.Unauthorized, 'Authorization token is missing or invalid.');
    }
  }

  async verifyToken(token, userId) {
    try {
      await  this.validateToken(token);
      const decoded = jwt.verify(token.replace('Bearer ', ''), this.tokenSecret);
      
      if (decoded.id !== userId) {
        throw new AppError(HttpStatusCode.Unauthorized, 'Unauthorized access, please try again');
      }

      return { status: true, decoded };
    } catch (error) {
      throw new AppError(HttpStatusCode.Unauthorized, `Invalid token: ${error.message}`);
    }
  }

  async verifyLoginToken(token, userId) {
    try {
      await  this.validateToken(token);
      const decoded = jwt.verify(token.replace('Bearer ', ''), this.tokenSecret);
      
      if (decoded.id !== userId) {
        throw new AppError(HttpStatusCode.Unauthorized, 'Unauthorized access, please try again');
      }

      return { status: true, token };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return await this.handleExpiredToken(userId);
      } else {
        throw new AppError(HttpStatusCode.Unauthorized, `Invalid token: ${error.message}`);
      }
    }
  }

  async handleExpiredToken(userId) {
    const refreshToken = await this.redisService.get(`refreshToken:${userId}`);

    if (refreshToken) {
      try {
        jwt.verify(refreshToken.replace('Bearer ', ''), this.tokenSecret);

        const newLoginToken = this.generateJwtToken(userId, this.tokenSecret, '30m');
        return {
          status: true,
          token: `Bearer ${newLoginToken}`,
        };
      } catch (err) {
        throw new AppError(HttpStatusCode.Unauthorized, 'Invalid token or token expired');
      }
    } else {
      throw new AppError(HttpStatusCode.Unauthorized, 'Unauthorized access, please log in again');
    }
  }
}

export default JwtService;
