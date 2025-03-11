import { HttpStatusCode } from "axios";
import { AppError } from "@flextest/apperrorhandler";
import UserRepository from "../repositories/userRepository.js";



class ValidationService {
    constructor(userRepository = new UserRepository()) {
      this.userRepository = userRepository;
    }
    async checkIfEmailIsUsed(email) {
        const user = await this.userRepository.findUserByEmail(email);
        if (user) {
          throw new AppError(HttpStatusCode.BadRequest, 'Email is already in use');
        }
    }

    async validateString(input) {
      if (!input || input.trim() === '') {
        throw new AppError(HttpStatusCode.BadRequest, 'Invalid or missing input, try again');
      }
    }
}

export default ValidationService;
