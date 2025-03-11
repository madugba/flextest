import axios, { HttpStatusCode } from 'axios';
import { AppError } from '@flextest/apperrorhandler';

class AxiosService {
  #axiosInstance;

  constructor(baseURL, timeout = 5000, headers = { 'Content-Type': 'application/json' }) {
    this.#axiosInstance = axios.create({
      baseURL,
      timeout,
      headers,
    });

    this.#setupInterceptors();
  }

  #setupInterceptors() {
    this.#axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
          throw new AppError(HttpStatusCode.Unauthorized, 'Unauthorized access. Please log in.');
        } else {
          throw new AppError(HttpStatusCode.BadRequest, `Something went wrong. Please try again later. ${error.message}`);
        }
      }
    );
  }

  async #makeRequest(method, url, data = {}, params = {}, token = '') {
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params,
      };

      const response = await this.#axiosInstance[method](url, method === 'get' || method === 'delete' ? config : data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get(url, params = {}, token = '') {
    return this.#makeRequest('get', url, {}, params, token);
  }

  async post(url, data = {}, token = '') {
    return this.#makeRequest('post', url, data, {}, token);
  }

  async put(url, data = {}, token = '') {
    return this.#makeRequest('put', url, data, {}, token);
  }

  async delete(url, token = '') {
    return this.#makeRequest('delete', url, {}, {}, token);
  }
}

export default AxiosService;