import { authClient } from "./grpc_config.js";
import { createBadRequestError } from '@flextest/apperrorhandler';

const callAuthClient = async (method, request) =>{
    return new Promise((resolve, reject) => {
      authClient[method](request, (err, response) => {
        if (err) {
          reject(createBadRequestError(err.message));
        }
        resolve(response);
      });
    });
}

export default callAuthClient;