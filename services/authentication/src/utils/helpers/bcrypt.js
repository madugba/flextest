import { HttpStatusCode } from 'axios';
import bcrypt from 'bcrypt';
import { AppError } from '@flextest/apperrorhandler';




const hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error hashing password');
    }
  };


const comparePassword = async (hashedPassword, password) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Error comparing passwords');
    }
  };




  export {
    hashPassword,
    comparePassword
  }