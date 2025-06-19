import SocketIoInstance from '@Library/socket';
import type { LobbyListenerEvents, LobbyListListenerEvents } from '@Library/socket/types';
import type { GetFn, SetFn, SocketState, SocketStore } from '@Types';
import { create } from 'zustand';
import useLobbyStore from './useLobbyStore';

const initialState: SocketState = {
    socket: null,
    isConnectingToSocket: false,
    lobbyListenerEvents: null,
    lobbyListListenerEvents: null,
};

const useSocketStore = create<SocketStore>((set, get) => ({
    ...initialState,
    connectSocket: createConnectSocket(set, get),
    disconnectSocket: createDisconnectSocket(set, get),
    setLobbyListenerEvents: createSetLobbyListenerEvents(set),
    setLobbyListListenerEvents: createSetLobbyListListenerEvents(set),
    reset: createReset(set, get),
}));

function createConnectSocket(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return async () => {
        const {
            isConnectingToSocket,
            lobbyListenerEvents,
            setLobbyListenerEvents,
            lobbyListListenerEvents,
            setLobbyListListenerEvents,
        } = get();
        const socketIsConnected = !!get().socket;
        if (isConnectingToSocket) {
            return console.error('Could not connect to socket: already connecting');
        }
        if (socketIsConnected) {
            return console.error('Could not connect to socket: already connected');
        }
        set((state) => ({ ...state, isConnectingToSocket: true }));
        const socket = new SocketIoInstance();
        await socket.initialize();
        socket.on('connect', () => {
            if (!lobbyListenerEvents) {
                setLobbyListenerEvents();
            }
            if (!lobbyListListenerEvents) {
                setLobbyListListenerEvents();
            }
            set((state) => ({ ...state, socket: socket, isConnectingToSocket: false }));
        });
        socket.on('connect_error', () => {
            set((state) => ({ ...state, isConnectingToSocket: false }));
        });
    };
}

function createDisconnectSocket(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return () => {
        const { socket } = get();
        if (!socket) {
            return console.error('Could not disconnect socket: no socket connected');
        }
        socket.disconnect();
        set(() => ({ socket: null, lobbyListenerEvents: null }));
    };
}

function createSetLobbyListenerEvents(set: SetFn<SocketState>) {
    return () => {
        const { setPlayerReady, addNewPlayer, removePlayer, startLobby } = useLobbyStore.getState();
        const events: LobbyListenerEvents = {
            set_player_ready: (playerId) => setPlayerReady(playerId),
            add_new_player: (player) => addNewPlayer(player),
            remove_player: (playerId) => removePlayer(playerId),
            start_lobby: (lobby_id) => startLobby(lobby_id),
        };
        set((state) => ({
            ...state,
            lobbyListenerEvents: events,
        }));
    };
}

function createSetLobbyListListenerEvents(set: SetFn<SocketState>) {
    const {
        removeLobbyFromList,
        addLobbyToList,
        updateInGameStatus,
        updatePlayerCount,
        startLobby,
    } = useLobbyStore.getState();
    return () => {
        const events: LobbyListListenerEvents = {
            start_lobby: (lobby_id) => startLobby(lobby_id),
            remove_lobby: (lobby_id) => removeLobbyFromList(lobby_id),
            add_lobby: (lobby) => addLobbyToList(lobby),
            update_inGame: (lobby_id, inGame) => updateInGameStatus(lobby_id, inGame),
            update_player_count: (lobby_id, currentPlayers) =>
                updatePlayerCount(lobby_id, currentPlayers),
        };
        set((state) => ({ ...state, lobbyListListenerEvents: events }));
    };
}

function createReset(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return () => {
        const { disconnectSocket } = get();
        disconnectSocket();
        set(() => initialState);
    };
}

export default useSocketStore;
