import SocketIoInstance from '@Library/socket';
import type { GetFn, SetFn, SocketState, SocketStore } from '@Types';
import { create } from 'zustand';

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connectedToGeneralLobby: false,
    currentLobbyId: null,
    connectSocket: createConnectSocket(set, get),
    disconnectSocket: createDisconnectSocket(set, get),
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

export default useSocketStore;
