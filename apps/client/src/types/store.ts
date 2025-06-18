import type SocketIoInstance from '@Library/socket';
import type { LobbyListenerEvents, LobbyListListenerEvents } from '@Library/socket/types';
import type { LobbyListData, LobbySettings, MyProfile, PublicLobbyProfile } from '@monorepo/shared';
import type { ClientLobby } from 'src/features/lobby/classes/Lobby';
import type { LobbyMap } from 'src/features/lobbyList/classes/LobbyMap';
import type { StoreApi } from 'zustand';

export type SetFn<T> = StoreApi<T>['setState'];
export type GetFn<T> = StoreApi<T>['getState'];



export interface AuthState {
    user: null | MyProfile;
    authorized: null | boolean;
}
export interface AuthActions {
    setUser: (user: MyProfile) => void;
    removeUser: () => void;
}
export type AuthStore = AuthState & AuthActions;



export interface SocketState {
    socket: SocketIoInstance | null;
    isConnectingToSocket: boolean;
    lobbyListenerEvents: LobbyListenerEvents | null;
    lobbyListListenerEvents: LobbyListListenerEvents | null
}
export interface SocketActions {
    connectSocket: () => void;
    disconnectSocket: () => void;
    setLobbyListenerEvents: () => void;
    setLobbyListListenerEvents: () => void;
}
export type SocketStore = SocketState & SocketActions;



export interface LobbyState {
    currentLobby: ClientLobby | null;
    lobbyMap: LobbyMap | null;
}
export interface LobbyActions {
    joinLobbyList: () => void;
    leaveLobbyList: () => void;
    addLobbyToList: (lobby: LobbyListData) => void
    removeLobbyFromList: (lobby_id: string) => void;
    updatePlayerCount: (lobby_id: string, playerCount: number) => void;
    updateInGameStatus: (lobby_id: string, inGame: boolean) => void;

    joinLobby: (lobbyId: string) => void;
    leaveLobby: (lobbyId: string) => void;
    setLobby: (lobby: ClientLobby) => void;
    emitSetPlayerReady: (playerId: string) => void;
    setPlayerReady: (playerId: string) => void;
    addNewPlayer: (player: PublicLobbyProfile) => void;
    removePlayer: (playerId: string) => void;
    createNewLobby: (settings: LobbySettings) => void;
}
export type LobbyStore = LobbyActions & LobbyState;