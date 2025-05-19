import { useAuthStore } from '@Store';
import type { AxiosError } from 'axios';

export async function resErrorInterceptor(error: AxiosError) {
    if (error.status === 401) {
        if (useAuthStore.getState().user) {
            window.alert('Your session has expired');
            useAuthStore.getState().removeUser();
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
    }
    Promise.reject(error);
}
