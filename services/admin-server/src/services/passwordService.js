import { HttpStatusCode } from "axios";
import { AppError } from "@flextest/apperrorhandler";
import redis from '../config/redis.js';
import forgotPasswordEmailBody from '../utils/emailboilerplate/forgotpassword.js';
import passwordChangeConfirmation from "../utils/emailboilerplate/passwordchangeconfirmation.js";
import sendEmail from "../utils/helpers/email.js";
import AuthService from "./authService.js";
import UserService from "./userService.js";
import ValidationService from "./validationService.js";

class PasswordService {
  #redisService;
  #userService;
  #emailService;
  #authService;
  #validate;

  constructor(
    redisService = redis,
    userService = new UserService(),
    emailService = sendEmail,
    authService = new AuthService(),
    validate = new ValidationService()
  ) {
    this.#redisService = redisService;
    this.#userService = userService;
    this.#emailService = emailService;
    this.#authService = authService;
    this.#validate = validate
  }

  async requestNewPassword(email) {
    await this.#validate.validateEmail(email);
    const { data } = await this.#userService.findUserByEmail(email);
    const otp = await this.#sendPasswordResetEmail(data);
    await this.#storeOtpInCache(data.userId, otp);
    const { token } = await this.#authService.generateLoginToken(data.userId);
    return { token, userId: data.userId };
  }

  async verifyOTP(userId, otp) {
    await this.#validate.validateString(userId);
    await this.#validate.validateString(otp);
    const storedOtp = await this.#getStoreOtpInCache(userId);
    if (Number(storedOtp) !== Number(otp)) {
      throw new AppError(HttpStatusCode.Unauthorized, 'Invalid or expired OTP');
    }
    await this.#redisService.delete(`OTP:${userId}`);
    const { token } = await this.#userService.generateAccessToken(userId);
    return { status: true, token, userId };
  }

  async changePasswordExternal(userId, newPassword) {
    await this.#validate.validateString(userId);
    const { data } = await this.#userService.findUserByUserId(userId);
    await this.#userService.updateExternalPassword(newPassword, userId);
    await this.#sendPasswordResetConfirmation(data);
    return true;
  }

  async changePasswordInternal(userId, oldPassword, newPassword) {
    await this.#validate.validateString(userId);
    const { data } = await this.#userService.findUserByUserId(userId);
    await this.#userService.updateInternalPassword(newPassword, oldPassword, userId);
    await this.#sendPasswordResetConfirmation(data);
    return true;
  }

  async #sendPasswordResetEmail(user) {
    if(!user) throw new AppError(HttpStatusCode.InternalServerError, 'User data not supplied')
    const emailBody = forgotPasswordEmailBody.replace('{user_name}', user.name);
    const sendMail = await this.#emailService(user.email, 'Password Change Requested - Flextest', emailBody);
    if (!sendMail) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Failed to send password reset message, try again');
    }
    return sendMail.otp;
  }

  async #sendPasswordResetConfirmation(user) {
    const emailBody = passwordChangeConfirmation.replace('{user_name}', user.name);
    const sendMail = await this.#emailService(user.email, 'Password Change Confirmation - Flextest', emailBody);
    if (!sendMail) {
      throw new AppError(HttpStatusCode.InternalServerError, 'Failed to send confirmation message, try again');
    }
  }

  async #storeOtpInCache(userId, otp) {
    await this.#redisService.set(`OTP:${userId}`, otp, 600);
  }

  async #getStoreOtpInCache(userId) {
    try {
      return this.#redisService.get(`OTP:${userId}`);
    } catch (error) {
      throw new AppError(HttpStatusCode.BadRequest, 'valid or expire OTP. Note that OTP expires after 10 minutes');
    }
  }

}

export default PasswordService;