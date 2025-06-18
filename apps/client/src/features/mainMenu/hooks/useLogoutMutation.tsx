import { useAuthStore } from '@Store';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../services/logoutService';

function useLogoutMutation() {
    const { handleLogout } = useAuthStore();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            handleLogout();
        },
    });
}

export default useLogoutMutation;
