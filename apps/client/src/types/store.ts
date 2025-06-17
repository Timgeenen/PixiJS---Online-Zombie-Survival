import type SocketIoInstance from '@Library/socket';
import type { LobbyListenerEvents } from '@Library/socket/types';
import type { Lobby, LobbySettings, MyProfile, PublicLobbyProfile } from '@monorepo/shared';
import type { ClientLobby } from 'src/features/lobby/classes/Lobby';
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
    isConnectingToSocket: boolean;
    currentLobby: ClientLobby | null;
    lobbyListenerEvents: LobbyListenerEvents | null;
}

export interface SocketActions {
    connectSocket: () => void;
    disconnectSocket: () => void;
    setLobbyListenerEvents: () => void;
    joinLobby: (lobbyId: string) => void;
    leaveLobby: (lobbyId: string) => void;
    setLobby: (lobby: ClientLobby) => void;
    emitSetPlayerReady: (playerId: string) => void;
    setPlayerReady: (playerId: string) => void;
    addNewPlayer: (player: PublicLobbyProfile) => void;
    removePlayer: (playerId: string) => void;
    createNewLobby: (settings: LobbySettings) => void;
}

export type SocketStore = SocketState & SocketActions;
