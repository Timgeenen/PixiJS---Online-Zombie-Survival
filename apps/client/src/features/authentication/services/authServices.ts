import { HTTPClient } from '@API';

type Credentials = {
    username: string;
    password: string;
};

export async function login(credentials: Credentials) {
    const response = await HTTPClient.post('/api/auth/login', credentials);
    console.log(response);
}
