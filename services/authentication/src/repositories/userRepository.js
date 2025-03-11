import prismaSchema from '../prismaClient.js';
import { AppError } from '@flextest/apperrorhandler';
import { HttpStatusCode } from 'axios';

class UserRepository {
    #model;  
    constructor(model = prismaSchema.examiners) {
        this.#model = model;
    }
    async createUser(data) {
      try{
        return await this.#model.create({ data });
      }catch(error){
        throw new AppError(HttpStatusCode.BadRequest, error.message);
      }
    }
  
    async findUserByEmail(email) {
      return await this.#model.findUnique({ where: { email } });
    }
    async findUserByUserid(userId) {
      return await this.#model.findUnique({ where: { userId } });
    }

    async updatePassword(hashedPassword, userId) {
      try{
        return await this.#model.update({ where: { userId }, data: { password: hashedPassword } });
      }catch(error){
        throw new AppError(HttpStatusCode.BadRequest, error.message);
      }
    }
}
  
export default UserRepository;