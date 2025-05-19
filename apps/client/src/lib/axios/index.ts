import axios, { type AxiosInstance } from 'axios';
import { resErrorInterceptor } from './interceptors';
import type { HTTPClient } from './types';

export class AxiosHTTPClient implements HTTPClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({ baseURL, withCredentials: true });
        this.axiosInstance.interceptors.response.use((response) => response, resErrorInterceptor);
    }

    async get<T>(url: string, config?: object): Promise<T> {
        const response = await this.axiosInstance.get(url, config && config);
        return response.data;
    }

    async post<T>(url: string, data: object, config?: object): Promise<T> {
        const response = await this.axiosInstance.post(url, data, config && config);
        return response.data;
    }

    async put<T>(url: string, data: object, config?: object): Promise<T> {
        const response = await this.axiosInstance.put(url, data, config && config);
        return response.data;
    }

    async delete<T>(url: string, config?: object): Promise<T> {
        const response = await this.axiosInstance.delete(url, config && config);
        return response.data;
    }
}
