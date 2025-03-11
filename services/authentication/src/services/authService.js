import { HttpStatusCode } from 'axios';
import { AppError } from '@flextest/apperrorhandler';
import BaseService from './baseService.js';

import UserRepository from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/helpers/bcrypt.js';
import JwtService from './jwtService.js';


class AuthService extends BaseService {
  constructor(userRepository = new UserRepository(), jwtService = new JwtService()){
    super(userRepository, jwtService)
  }
    async createUser(data) {
      const hashedPassword = await hashPassword(data.password);
      const user = await this.userRepository.createUser({ ...data, password: hashedPassword });
      if (!user) throw new AppError(HttpStatusCode.BadRequest, user.message);
      return user;
    }

    async login(email, password) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new AppError(HttpStatusCode.BadRequest, 'Invalid email address or password');
        const isValid = await comparePassword(user.password, password);
        if (!isValid) throw new AppError(HttpStatusCode.BadRequest, 'Invalid credentials, please try again');
        const token =  await this.jwtService.generateLoginToken(user.userId);
        return{
          token,
          user,
        }
    }

}

export default AuthService;
