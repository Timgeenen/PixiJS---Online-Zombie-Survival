import type { User } from '@Types';
import { create } from 'zustand';

const user = localStorage.getItem('user');

interface AuthStore {
    user: null | User;
    setUser: (user: User) => void;
    removeUser: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: user ? JSON.parse(user) : null,
    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        set(() => ({ user }));
    },
    removeUser: () => {
        localStorage.removeItem('user');
        set(() => ({ user: null }));
    },
}));

export default useAuthStore;
