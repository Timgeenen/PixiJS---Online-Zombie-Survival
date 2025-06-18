import { useInitializeApp } from '@Hooks';
import { useAuthStore } from '@Store';
import { Navigate, Outlet } from 'react-router';
import useSocketStore from 'src/store/useSocketStore';

function ProtectedRoute() {
    const { user } = useAuthStore((state) => state);
    const { socket } = useSocketStore((state) => state);
    useInitializeApp();
    return user ? (
        socket?.connected ? (
            <Outlet />
        ) : (
            <h1 className="text-9xl">Socket is connecting</h1>
        )
    ) : (
        <Navigate to="/" />
    );
}

export default ProtectedRoute;
