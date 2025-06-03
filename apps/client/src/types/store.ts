import type SocketIoInstance from '@Library/socket';
import type { Lobby, MyProfile } from '@monorepo/shared';
import type { StoreApi } from 'zustand';

//General types
export type SetFn<T> = StoreApi<T>['setState'];
export type GetFn<T> = StoreApi<T>['getState'];

//AuthStore types
export interface AuthState {
    user: null | MyProfile;
    authorized: null | boolean;
}

export interface AuthActions {
    setUser: (user: MyProfile) => void;
    removeUser: () => void;
}

export type AuthStore = AuthState & AuthActions;

//SocketStore types
export interface SocketState {
    socket: SocketIoInstance | null;
    connectedToGeneralLobby: boolean;
    currentLobby: Lobby | null;
}

export interface SocketActions {
    connectSocket: () => void;
    disconnectSocket: () => void;
    joinLobby: (lobbyId: string) => void;
    leaveLobby: (lobbyId: string) => void;
    setLobby: (lobby: Lobby) => void;
}

export type SocketStore = SocketState & SocketActions;
