import { HttpStatusCode } from 'axios';
import { AppError } from '@flextest/apperrorhandler';
import BaseService from './baseService.js';

import UserRepository from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/helpers/bcrypt.js';
import JwtService from './jwtService.js';

// Error messages
const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    PASSWORD_UPDATE_FAILED: 'Failed to update password, please try again',
    INTERNAL_ERROR: (message) => `An internal error occurred: ${message}`,
};

class PasswordService extends BaseService {
    constructor(userRepository = new UserRepository(), jwtService = new JwtService()) {
        super(userRepository, jwtService);
    }

    async findUserByEmail(email) {
        if (!email) {
            throw new AppError(HttpStatusCode.BadRequest, 'Email is required');
        }
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new AppError(HttpStatusCode.NotFound, ERROR_MESSAGES.USER_NOT_FOUND);
        return user;
    }

    async findUserByUserId(userId) {
        if (!userId) {
            throw new AppError(HttpStatusCode.BadRequest, 'User ID is required');
        }
        const user = await this.userRepository.findUserByUserid(userId);
        if (!user) throw new AppError(HttpStatusCode.NotFound, ERROR_MESSAGES.USER_NOT_FOUND);
        return user;
    }

    async createLoginToken(userId) {
        if (!userId) {
            throw new AppError(HttpStatusCode.BadRequest, 'User ID is required');
        }
        return await this.jwtService.generateLoginToken(userId);
    }

    async createAccessToken(userId) {
        if (!userId) {
            throw new AppError(HttpStatusCode.BadRequest, 'User ID is required');
        }
        return await this.jwtService.generateToken(userId);
    }
    
    async updateInternalPassword(newPassword, oldPassword, userId) {
        if (!newPassword || !oldPassword || !userId) {
            throw new AppError(HttpStatusCode.BadRequest, 'New password, old password, and user ID are required');
        }

        try {
            await this.validatePassword(oldPassword, userId);
            await this.updatePassword(userId, newPassword);
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(HttpStatusCode.InternalServerError, ERROR_MESSAGES.INTERNAL_ERROR(error.message));
        }
    }

    async updateExternalPassword(newPassword, userId) {
        if (!newPassword || !userId) throw new AppError(HttpStatusCode.BadRequest, 'New password and user ID are required');

        try {
            await this.updatePassword(userId, newPassword);
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(HttpStatusCode.InternalServerError, ERROR_MESSAGES.INTERNAL_ERROR(error.message));
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            const updated = await this.userRepository.updatePassword(hashedPassword, userId);
            if (!updated) {
                throw new AppError(HttpStatusCode.InternalServerError, ERROR_MESSAGES.PASSWORD_UPDATE_FAILED);
            }
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(HttpStatusCode.InternalServerError, ERROR_MESSAGES.INTERNAL_ERROR(error.message));
        }
    }

    async validatePassword(oldPassword, userId) {
        try {
            const user = await this.findUserByUserId(userId);
            await comparePassword(user.password, oldPassword);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(HttpStatusCode.BadRequest, error.message);
        }
    }
}

export default PasswordService;