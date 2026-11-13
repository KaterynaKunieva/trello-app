import axios from 'axios';
import { API_CONFIG } from './config';
import { GeneralApiError } from './GeneralApiError';
import { processErrorMessage } from '../common/utils/errors';
import { loader } from '../common/utils/loader';

const instance = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.request.use(
  (request) => {
    loader.show();
    return request;
  },
  (error) => {
    loader.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    loader.hide();
    return res.data;
  },
  (err: unknown): Promise<GeneralApiError> => {
    loader.hide();
    const message = processErrorMessage(err);
    return Promise.reject(new GeneralApiError(message, err));
  }
);

export default instance;
