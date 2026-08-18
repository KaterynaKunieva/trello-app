import 'axios';

declare module 'axios' {
  export interface AxiosInstance {
    get<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
    post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    delete<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  }
}
