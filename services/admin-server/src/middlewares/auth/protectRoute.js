import { HttpStatusCode } from "axios";
import { AppError, errorHandler } from "@flextest/apperrorhandler";
import validationService from "../../services/validationService.js";
import redis from "../../config/redis.js";
import PasswordService from "../../services/passwordService.js";
import AuthService from "../../services/authService.js";

const passwordService = new PasswordService();
const validate = new validationService();
const authService = new AuthService();

const getUserFromCacheOrDb = async (userId) => {
    try {
        const cachedUser = await redis.getServiceInstances(userId);
        if (cachedUser) return cachedUser;

        const {data} = await passwordService.findUserByUserId(userId);
        await redis.cacheServiceInstances(userId, data, 300);
        return data;
    } catch (error) {
        throw new AppError(HttpStatusCode.InternalServerError, `An internal error occurred: ${error.message}`);
    }
};


const validateTokenAndFetchUser = async (headerToken, userId) => {
    validate.validateUserId(userId);
    const { token } = await authService.verifyLoginToken(headerToken, userId);
    const user = await getUserFromCacheOrDb(userId);
  
    if (!user) {
      throw new AppError(HttpStatusCode.Unauthorized, 'Invalid userId, please retry with a valid id');
    }
  
    return { token, user };
  };

const protectRoute = async (req, res, next) => {
    const headerToken = req.headers.authorization;
    const { userId } = req.body || req.params;
  
    try {
      const { token, user } = await validateTokenAndFetchUser(headerToken, userId);
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      errorHandler(error, res, next);
    }
  };

export default protectRoute;
