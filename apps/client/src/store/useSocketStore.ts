import SocketIoInstance from '@Library/socket';
import { create } from 'zustand';

interface SocketStore {
    socket: SocketIoInstance | null;
    connectedToGeneralLobby: boolean;
    currentLobbyId: string | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
    // joinroom: (id: string) => void;
}

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    connectedToGeneralLobby: false,
    currentLobbyId: null,
    connectSocket: async () => {
        const socketIsConnected = !!get().socket;
        if (socketIsConnected) {
            return console.error('Could not connect to socket: already connected');
        }
        const socket = new SocketIoInstance();
        socket.initialize();
        socket.on('connect', () => {
            set(() => ({ socket: socket }));
        })
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (!socket) {
            return console.error('Could not disconnect socket: no socket connected');
        }
        socket.disconnect();
        set(() => ({ socket: null }));
    },
    // joinroom: (id) => {},
}));

export default useSocketStore;
