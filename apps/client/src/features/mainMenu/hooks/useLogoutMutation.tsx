import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/logoutService';
import { useAuthStore } from '@Store';
import useSocketStore from 'src/store/useSocketStore';

function useLogoutMutation() {
    const { removeUser } = useAuthStore();
    const { disconnectSocket } = useSocketStore();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            removeUser();
            disconnectSocket();
        },
    });
}

export default useLogoutMutation;
