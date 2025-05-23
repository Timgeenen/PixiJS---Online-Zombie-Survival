import type { AuthState, AuthStore, SetFn, User } from '@Types';
import { create } from 'zustand';

const userString = localStorage.getItem('user');
const user: User | null = userString ? JSON.parse(userString) : null;

const useAuthStore = create<AuthStore>((set) => ({
    user: user,
    authorized: null,
    setUser: createSetUser(set),
    removeUser: createRemoveUser(set),
}));

function createSetUser(set: SetFn<AuthState>) {
    return (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        set((state) => ({ ...state, user }));
    };
}

function createRemoveUser(set: SetFn<AuthState>) {
    return () => {
        localStorage.removeItem('user');
        set((state) => ({ ...state, user: null }));
    };
}

export default useAuthStore;
