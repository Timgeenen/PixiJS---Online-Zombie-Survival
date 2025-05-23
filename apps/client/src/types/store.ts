import type SocketIoInstance from '@Library/socket';
import type { StoreApi } from 'zustand';
import type { User } from './user';

//General types
export type SetFn<T> = StoreApi<T>['setState'];
export type GetFn<T> = StoreApi<T>['getState'];

//AuthStore types
export interface AuthState {
    user: null | User;
    authorized: null | boolean;
}

export interface AuthActions {
    setUser: (user: User) => void;
    removeUser: () => void;
}

export type AuthStore = AuthState & AuthActions;

//SocketStore types
export interface SocketState {
    socket: SocketIoInstance | null;
    connectedToGeneralLobby: boolean;
    currentLobbyId: string | null;
}

export interface SocketActions {
    connectSocket: () => void;
    disconnectSocket: () => void;
    // joinroom: (id: string) => void;
}

export type SocketStore = SocketState & SocketActions;
