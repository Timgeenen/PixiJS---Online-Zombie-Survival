import { HTTPClient } from '@API';
import type {
    ApiResponse,
    LoginCredentials,
    MyProfile,
    RegisterCredentials,
} from '@monorepo/shared';

export async function login(credentials: LoginCredentials): Promise<ApiResponse<MyProfile>> {
    const response: ApiResponse<MyProfile> = await HTTPClient.post('/api/auth/login', credentials);
    return response;
}

export async function guestLogin() {
    //TODO: Change to guest profile
    const response: ApiResponse<MyProfile> = await HTTPClient.get('/api/auth/guest');
    return response;
}

export async function register(credentials: RegisterCredentials) {
    const response: ApiResponse<MyProfile> = await HTTPClient.post(
        '/api/auth/register',
        credentials,
    );
    return response;
}
