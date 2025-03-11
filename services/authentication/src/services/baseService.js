class BaseService {
    #userRepository;
    #jwtService;

    constructor(userRepository, jwtService) {
        this.#userRepository = userRepository;
        this.#jwtService = jwtService;
    }

    get userRepository() {
        return this.#userRepository;
    }

    get jwtService() {
        return this.#jwtService;
    }
}

export default BaseService;
