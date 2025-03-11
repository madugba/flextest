import { HttpStatusCode } from "axios";
import { AppError } from "@flextest/apperrorhandler";
import callAuthClient from "../config/grpc_client.js";

class UserService {
    #GRPCRequest
    
    constructor(grpcclient = callAuthClient){
        this.#GRPCRequest = grpcclient

    }

    async updateInternalPassword(newPassword, oldPassword, userId) {
        return this.#GRPCRequest('UpdateInternalPassword', { userId, oldPassword, newPassword });
    }
    
    async updateExternalPassword(password, userId) {
        return this.#GRPCRequest('UpdateExternalPassword', { userId, password });
    }
    
    async findUserByEmail(email) {
        try {
          return this.#GRPCRequest('FindUserByEmail', { email });
        } catch (error) {
          throw new AppError(HttpStatusCode.BadRequest, error.message);
        }
    }
    
    async findUserByUserId(userId) {
        try {
          return this.#GRPCRequest('FindUserByUserId', { userId });
        } catch (error) {
          throw new AppError(HttpStatusCode.BadRequest, error.message);
        }
    }

    async generateAccessToken(userId) {
        return this.#GRPCRequest('CreateToken', { userId });
    }

    async verifyToken(token, userId) {
        try {
            return this.#GRPCRequest('VerifyToken', { token, userId });
        } catch (error) {
            throw new AppError(HttpStatusCode.BadRequest, error.message);
        }
    }

}

export default UserService;
