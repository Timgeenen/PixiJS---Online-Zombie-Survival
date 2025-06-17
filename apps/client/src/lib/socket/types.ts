import type {
    JoinLobbyData,
    LobbySettings,
    PublicLobbyProfile,
    ResponseLobbyData,
    SocketResponse,
    // SocketJoinLobbyData,
    // SocketJoinLobbyResponse,
    // SocketLeaveLobbyData,
    // SocketResponseBase,
} from '@monorepo/shared';

export type SocketEvents<T> = {
    [K in keyof T]: T[K];
};
export type ListenerEvents = StandardListenerEvents & LobbyListenerEvents;

export interface StandardListenerEvents {
    connect: () => void;
    disconnect: () => void;
    connect_error: (error: Error) => void;
}

export interface LobbyListenerEvents {
    set_player_ready: (playerId: string) => void;
    add_new_player: (player: PublicLobbyProfile) => void;
    remove_player: (playerId: string) => void;
}

export interface EmitEvents {
    create_new_lobby: (
        settings: LobbySettings,
        callback: (response: SocketResponse<ResponseLobbyData>) => void,
    ) => void;
    join_lobby: (
        data: JoinLobbyData,
        callback: (response: SocketResponse<ResponseLobbyData>) => void,
    ) => void;
    leave_lobby: () => void;
    player_ready: (callback: (response: SocketResponse<void>) => void) => void;
}

export interface SocketInstance {
    initialize: () => void;
    disconnect: () => void;
    on: <K extends keyof ListenerEvents>(event: K, callback: ListenerEvents[K]) => void;
    emit: <K extends keyof EmitEvents>(event: K, ...args: Parameters<EmitEvents[K]>) => void;
}
