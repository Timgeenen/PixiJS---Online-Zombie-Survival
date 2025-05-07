export type FormType = 'login' | 'register';

export type Credentials = {
    username: string;
    password: string;
    email?: string;
};

export type InputRefs = { [key: string]: HTMLInputElement | null };
