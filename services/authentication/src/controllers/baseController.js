import handleGrpcError from '../utils/helpers/errorhandler.js';

class BaseController {
  #validationService;
  #authService;
  #jwtService;
  #passwordService;

  constructor(validationService, authService, jwtService, passwordService) {
    this.#validationService = validationService;
    this.#authService = authService;
    this.#jwtService = jwtService;
    this.#passwordService = passwordService;
  }

  get validationService() {
    return this.#validationService;
  }

  get authService() {
    return this.#authService;
  }

  get jwtService() {
    return this.#jwtService;
  }

  get passwordService() {
    return this.#passwordService;
  }

  async handleRequest(call, callback, requestHandler) {
    try {
      const response = await requestHandler(call.request);
      callback(null, response);
    } catch (error) {
      handleGrpcError(error, callback);
    }
  }
}

export default BaseController;