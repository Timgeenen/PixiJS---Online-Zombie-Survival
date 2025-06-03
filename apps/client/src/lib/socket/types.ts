import type {
    SocketJoinLobbyData,
    SocketJoinLobbyResponse,
    SocketLeaveLobbyData,
} from '@monorepo/shared';

export interface ListenerEvents {
    connect: () => void;
    disconnect: () => void;
    connect_error: (error: Error) => void;
}

export interface EmitEvents {
    join_lobby: (
        data: SocketJoinLobbyData,
        callback: (response: SocketJoinLobbyResponse) => void,
    ) => void;
    leave_lobby: (
        data: SocketLeaveLobbyData,
        callback: (response: SocketJoinLobbyResponse) => void,
    ) => void;
}

export interface SocketInstance {
    initialize: () => void;
    disconnect: () => void;
    on: <K extends keyof ListenerEvents>(event: K, callback: ListenerEvents[K]) => void;
    emit: <K extends keyof EmitEvents>(event: K, ...args: Parameters<EmitEvents[K]>) => void;
}
