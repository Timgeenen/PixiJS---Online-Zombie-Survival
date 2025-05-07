import { HTTPClient } from '@API';
import type { Credentials } from '../types';

export async function login(credentials: Credentials) {
    const response = await HTTPClient.post('/api/auth/login', credentials);
    console.log(response);
}

export async function guestLogin() {
    const response = await HTTPClient.get('/api/auth/guest');
    console.log(response);
}

export async function register(credentials: Credentials) {
    const response = await HTTPClient.post('/api/auth/register', credentials);
    console.log(response);
}
