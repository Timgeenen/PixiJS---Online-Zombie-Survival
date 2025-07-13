import type {
    ClientData,
    GameState,
    JoinLobbyData,
    LobbyData,
    LobbyList,
    LobbyListData,
    LobbySettings,
    PublicLobbyProfile,
    ServerPacket,
    ServerTickData,
    SocketResponse,
} from '@monorepo/shared';

export type SocketEvents<T> = {
    [K in keyof T]: T[K];
};
export type ListenerEvents = StandardListenerEvents & LobbyListenerEvents & GameListenerEvents;

export interface StandardListenerEvents {
    connect: () => void;
    disconnect: () => void;
    connect_error: (error: Error) => void;
}

export interface LobbyListenerEvents {
    set_player_ready: (playerId: string) => void;
    add_new_player: (player: PublicLobbyProfile) => void;
    remove_player: (playerId: string) => void;
    start_lobby: (lobby_id: string) => void;
}

export interface LobbyListListenerEvents {
    add_lobby: (lobby: LobbyListData) => void;
    remove_lobby: (lobby_id: string) => void;
    update_inGame: (lobby_id: string, inGame: boolean) => void;
    update_player_count: (lobby_id: string, currentPlayers: number) => void;
    start_lobby: (lobby_id: string) => void;
}

export type EmitEvents = GameEmitEvents & LobbyEmitEvents;

export interface GameEmitEvents {
    game_player_ready: (callback: (response: SocketResponse<void>) => void) => void;
    initialize_game: (callback: (response: SocketResponse<GameState>) => void) => void;
    game_update: (data: ClientData) => void;
    ping: (callback: (response: SocketResponse<ServerTickData>) => void) => void;
}

export interface GameListenerEvents {
    game_update: (gameState: ServerPacket) => void;
    game_start: (gameData: ServerTickData) => void;
}

export interface LobbyEmitEvents {
    start_lobby: () => void;
    join_lobby_list: (callback: (response: SocketResponse<LobbyList>) => void) => void;
    leave_lobby_list: () => void;
    create_new_lobby: (
        settings: LobbySettings,
        callback: (response: SocketResponse<LobbyData>) => void,
    ) => void;
    join_lobby: (
        data: JoinLobbyData,
        callback: (response: SocketResponse<LobbyData>) => void,
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
