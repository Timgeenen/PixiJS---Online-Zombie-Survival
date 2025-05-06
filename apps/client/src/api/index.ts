import { AxiosHTTPClient } from '@Library/axios';

export const HTTPClient = new AxiosHTTPClient(import.meta.env.VITE_BACKEND_URL);
