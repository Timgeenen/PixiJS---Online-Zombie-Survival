import type { MyProfile } from '@monorepo/shared';
import type { AuthState, AuthStore, SetFn } from '@Types';
import { create } from 'zustand';

const userString = localStorage.getItem('user');
const user: MyProfile | null = userString ? JSON.parse(userString) : null;

const useAuthStore = create<AuthStore>((set) => ({
    user: user,
    authorized: null,
    setUser: createSetUser(set),
    removeUser: createRemoveUser(set),
}));

function createSetUser(set: SetFn<AuthState>) {
    return (user: MyProfile) => {
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
