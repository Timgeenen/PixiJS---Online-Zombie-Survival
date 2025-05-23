import { useInitializeApp } from '@Hooks';
import { useAuthStore } from '@Store';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
    const user = useAuthStore((state) => state.user);
    useInitializeApp();
    return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
