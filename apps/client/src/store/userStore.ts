import type { User } from '@Types';
import { create } from 'zustand';

interface UserStore {
    user: {} | User;
    setUser: (user: User) => void;
    removeUser: () => void;
}

const userStore = create<UserStore>((set) => ({
    user: {},
    setUser: () => set((state) => ({ user: state.user })),
    removeUser: () => set(() => ({ user: {} })),
}));

export default userStore;
