import { authorizeUser } from '@Services';
import { useAuthStore } from '@Store';
import { useEffect } from 'react';
import useSocketStore from 'src/store/useSocketStore';

function useInitializeApp() {
    const { connectSocket, socket, disconnectSocket } = useSocketStore((state) => state);
    const { user, removeUser } = useAuthStore();
    useEffect(() => {
        async function initializeApp() {
            const authorized = await authorizeUser();
            if (!authorized.success) {
                if (user) {
                    removeUser();
                }
                throw new Error('Could not authorize user');
            }
            connectSocket();
        }
        initializeApp();
        return () => {
            if (socket) {
                disconnectSocket();
            }
        };
    }, []);
}

export default useInitializeApp;
