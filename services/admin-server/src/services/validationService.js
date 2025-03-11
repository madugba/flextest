import joi from "joi";
import { HttpStatusCode } from "axios";
import { AppError } from "@flextest/apperrorhandler";
import userValidationSchema from "../config/joiValidator.js";

class ValidationService {
  #validationSchema;

  constructor(validationSchema = userValidationSchema) {
    this.#validationSchema = validationSchema;
  }

  async validateEmail(email) {
    const emailSchema = joi.object({
      email: this.#validationSchema.extract('email'),
    });
    await this.#validateSchema(emailSchema, { email }, 'Invalid email format');
  }

  async validatePassword(password) {
    const passwordSchema = joi.object({
      password: this.#validationSchema.extract('password'),
    });
    await this.#validateSchema(passwordSchema, { password }, 'Invalid password format');
  }

  async validateUserId(userId) {
    if (!userId || userId.trim() === '') {
      throw new AppError(HttpStatusCode.BadRequest, 'userId missing or invalid.');
    }
  }

  async validateString(input) {
    if (!input || input.trim() === '') {
      throw new AppError(HttpStatusCode.BadRequest, 'Invalid or missing input, try again');
    }
  }

  async #validateSchema(schema, data, errorMessage) {
    try {
      await schema.validateAsync(data);
    } catch (error) {
      if (error instanceof joi.ValidationError) {
        throw new AppError(HttpStatusCode.BadRequest, error.details[0].message);
      }
      throw new AppError(HttpStatusCode.InternalServerError, errorMessage);
    }
  }
}

export default ValidationService;