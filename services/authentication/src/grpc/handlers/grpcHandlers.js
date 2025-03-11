import AuthController from "../../controllers/authController.js";

const createGrpcHandlers = (controller, methodMappings) => {
    return Object.entries(methodMappings).reduce((handlers, [handlerName, methodName]) => {
        if (typeof controller[methodName] === "function") {
            handlers[handlerName] = controller[methodName].bind(controller);
        } else {
            console.warn(`Method "${methodName}" not found in controller.`);
        }
        return handlers;
    }, {});
};

const authMethodMappings = {
    CreateUser: "registerUser",
    LoginUser: "loginUser",
    FindUserByEmail: "findUserByEmail",
    FindUserByUserId: "findUserByUserId",
    CreateLoginToken: "createLoginToken",
    CreateToken: "createToken",
    UpdateExternalPassword: "updateExternalPassword",
    UpdateInternalPassword: "updateInternalPassword",
    VerifyToken: "verifyToken",
    VerifyLoginToken: "verifyLoginToken",
};

const authController = new AuthController();
const grpcHandlers = createGrpcHandlers(authController, authMethodMappings);

export default grpcHandlers;