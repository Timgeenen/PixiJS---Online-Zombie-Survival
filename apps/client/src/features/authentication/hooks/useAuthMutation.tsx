import type { Credentials } from '@monorepo/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import userStore from 'src/store/userStore';
import { login, register } from '../services/authServices';

function useAuthMutation(type: 'login' | 'register' | 'guest') {
    const { setUser } = userStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials?: Credentials) => {
            if (!credentials) {
                throw new Error('Missing credentials');
            }
            if (type === 'login') {
                return await login(credentials);
            }
            if (type === 'register') {
                return await register(credentials);
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
