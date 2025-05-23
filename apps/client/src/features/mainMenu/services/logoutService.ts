import { HTTPClient } from '@API';

export async function logout() {
    const promise = await HTTPClient.get('/api/auth/logout');
    return promise;
}
