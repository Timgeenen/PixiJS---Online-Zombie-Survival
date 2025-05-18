import { HTTPClient } from '@API';
import type { ApiResponse, Credentials } from '@monorepo/shared';
import type { User } from '@Types';

export async function login(credentials: Credentials): Promise<ApiResponse<User>> {
    const response: ApiResponse<User> = await HTTPClient.post('/api/auth/login', credentials);
    return response;
}

export async function guestLogin() {
    const response: ApiResponse<User> = await HTTPClient.get('/api/auth/guest');
    return response;
}

export async function register(credentials: Credentials) {
    const response: ApiResponse<User> = await HTTPClient.post('/api/auth/register', credentials);
    return response;
}
