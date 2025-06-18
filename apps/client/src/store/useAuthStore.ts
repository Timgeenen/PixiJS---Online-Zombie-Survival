import type { MyProfile } from '@monorepo/shared';
import type { AuthState, AuthStore, GetFn, SetFn } from '@Types';
import { create } from 'zustand';
import useSocketStore from './useSocketStore';
import useLobbyStore from './useLobbyStore';

const userString = localStorage.getItem('user');
const user: MyProfile | null = userString ? JSON.parse(userString) : null;

const initialState: AuthState = {
    user: user,
    authorized: null,
};

const useAuthStore = create<AuthStore>((set, get) => ({
    ...initialState,
    setUser: createSetUser(set),
    removeUser: createRemoveUser(set),
    handleLogout: createHandleLogout(get),
    reset: () => set(() => initialState),
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

function createHandleLogout(get: GetFn<AuthStore>) {
    return () => {
        const { removeUser, reset } = get();
        removeUser();
        reset();
        useSocketStore.getState().reset();
        useLobbyStore.getState().reset();
    };
}

export default useAuthStore;
