import BaseController from "./baseController.js";
import AuthService from "../services/authService.js";
import PasswordService from "../services/passwordService.js";
import JwtService from "../services/jwtService.js";
import ValidationService from "../services/validationService.js";

class AuthController extends BaseController {
  constructor(
    validationService = new ValidationService(),
    authService = new AuthService(),
    jwtService = new JwtService(),
    passwordService = new PasswordService()
  ) {
    super(validationService, authService, jwtService, passwordService);
  }

  async registerUser(call, callback) {
    await this.handleRequest(call, callback, async (data) => {
      await this.validationService.checkIfEmailIsUsed(data.email);
      const user = await this.authService.createUser(data);
      const { password, ...userWithoutPassword } = user;
      return { status: true, data: userWithoutPassword };
    });
  }

  async loginUser(call, callback) {
    await this.handleRequest(call, callback, async ({ email, password }) => {
      const userData = await this.authService.login(email, password);
      return { token: userData.token, data: userData.user };
    });
  }

  async createLoginToken(call, callback) {
    await this.handleRequest(call, callback, async ({ userId }) => {
      const token = await this.passwordService.createLoginToken(userId);
      return { userId, token };
    });
  }

  async createToken(call, callback) {
    await this.handleRequest(call, callback, async ({ userId }) => {
      const token = await this.passwordService.createAccessToken(userId);
      return { userId, token };
    });
  }

  async findUserByEmail(call, callback) {
    await this.handleRequest(call, callback, async ({ email }) => {
      const user = await this.passwordService.findUserByEmail(email);
      const { password, ...userWithoutPassword } = user;
      return { status: true, data: userWithoutPassword };
    });
  }

  async findUserByUserId(call, callback) {
    await this.handleRequest(call, callback, async ({ userId }) => {
      const user = await this.passwordService.findUserByUserId(userId);
      const { password, ...userWithoutPassword } = user;
      return { status: true, data: userWithoutPassword };
    });
  }

  async verifyToken(call, callback) {
    await this.handleRequest(call, callback, async ({ token, userId }) => {
      const isValid = await this.jwtService.verifyToken(token, userId);
      return { status: isValid.status, userId: isValid.decoded.id, token };
    });
  }

  async verifyLoginToken(call, callback) {
    await this.handleRequest(call, callback, async ({ token, userId }) => {
      const isValid = await this.jwtService.verifyLoginToken(token, userId);
      return { status: isValid.status, token: isValid.token };
    });
  }

  async updateInternalPassword(call, callback) {
    await this.handleRequest(call, callback, async ({ newPassword, oldPassword, userId }) => {
      const status = await this.passwordService.updateInternalPassword(newPassword, oldPassword, userId);
      return { status };
    });
  }

  async updateExternalPassword(call, callback) {
    await this.handleRequest(call, callback, async ({ userId, password }) => {
      console.log('The new password and UserId', password, userId);
      const status = await this.passwordService.updateExternalPassword(password, userId);
      return { status };
    });
  }
}

export default AuthController;