import {
    loginCredentialsSchema,
    registerCredentialsSchema,
    type LoginCredentials,
    type RegisterCredentials,
} from '@monorepo/shared';
import { useAuthStore } from '@Store';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login, register } from '../services/authServices';

function useAuthMutation(type: 'login' | 'register' | 'guest') {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials?: LoginCredentials | RegisterCredentials) => {
            if (!credentials) {
                throw new Error('Missing credentials');
            }
            if (type === 'login') {
                const result = loginCredentialsSchema.safeParse(credentials);
                if (result.error) {
                    console.error(result.error);
                    return alert('Invalid login credentials');
                }
                return await login(result.data);
            }
            if (type === 'register') {
                const result = registerCredentialsSchema.safeParse(credentials);
                if (result.error) {
                    throw new Error('Invalid register credentials');
                }
                return await register(result.data);
            }
        },
        onSuccess(data) {
            if (type === 'login' || type === 'guest') {
                const user = data?.data;
                if (!user) {
                    throw new Error('User not found');
                }
                setUser(user);
                navigate('/main');
            }
        },
        onError(error: any) {
            console.error(error);
            const message = error.response?.data?.error || 'Something went wrong';
            error.message = message;
        },
    });
}

export default useAuthMutation;
