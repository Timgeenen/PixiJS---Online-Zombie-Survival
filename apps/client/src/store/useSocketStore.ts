import SocketIoInstance from '@Library/socket';
import type { Lobby } from '@monorepo/shared';
import type { GetFn, SetFn, SocketState, SocketStore } from '@Types';
import { create } from 'zustand';

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connectedToGeneralLobby: false,
    currentLobby: null,
    connectSocket: createConnectSocket(set, get),
    disconnectSocket: createDisconnectSocket(set, get),
    joinLobby: createJoinLobby(set, get),
    leaveLobby: createLeaveLobby(set, get),
    setLobby: createSetLobby(set),
}));

function createConnectSocket(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return async () => {
        const socketIsConnected = !!get().socket;
        if (socketIsConnected) {
            return console.error('Could not connect to socket: already connected');
        }
        const socket = new SocketIoInstance();
        socket.initialize();
        socket.on('connect', () => {
            set(() => ({ socket: socket }));
        });
    };
}

function createDisconnectSocket(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return () => {
        const socket = get().socket;
        if (!socket) {
            return console.error('Could not disconnect socket: no socket connected');
        }
        socket.disconnect();
        set(() => ({ socket: null }));
    };
}

function createJoinLobby(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (lobbyId: string) => {
        const socket = get().socket;
        if (!socket) {
            return console.error('Could not join lobby: no socket connected');
        }
        socket.emit('join_lobby', { lobbyId }, (response) => {
            if (!response.success) {
                console.error(response.message);
                return alert(response.message);
            }
            set((state) => ({ ...state, currentLobby: response.data ?? null }));
        });
    };
}

function createLeaveLobby(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (lobbyId: string) => {
        const socket = get().socket;
        if (!socket) {
            return console.error('Could not leave lobby: no socket connected');
        }
        socket.emit('leave_lobby', { lobbyId }, (response) => {
            if (!response.success) {
                console.error(response.message);
                return alert(response.message);
            }
            set((state) => ({ ...state, currentLobby: null }));
        });
    };
}

function createSetLobby(set: SetFn<SocketState>) {
    return (lobby: Lobby) => {
        set((state) => ({ ...state, currentLobby: lobby }));
    };
}

export default useSocketStore;
