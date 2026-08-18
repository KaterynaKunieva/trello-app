import axios from 'axios';
import { api } from '../common/constants';
import { GeneralApiError } from './GeneralApiError';
import { processErrorMessage } from './utils';
import { loaderService } from '../services/loaderService';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.request.use(
  (request) => {
    loaderService.show();
    return request;
  },
  (error) => {
    loaderService.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    loaderService.hide();
    return res.data;
  },
  (err: unknown): Promise<GeneralApiError> => {
    loaderService.hide();
    const message = processErrorMessage(err);
    return Promise.reject(new GeneralApiError(message, err));
  }
);

export default instance;
