import SocketIoInstance from '@Library/socket';
import type { LobbyListenerEvents } from '@Library/socket/types';
import { lobbySettingsSchema, type LobbySettings, type PublicLobbyProfile } from '@monorepo/shared';
import type { GetFn, SetFn, SocketState, SocketStore } from '@Types';
import {
    createLobby,
    isMultiplayerLobby,
    type ClientLobby,
} from 'src/features/lobby/classes/Lobby';
import { create } from 'zustand';
import useAuthStore from './useAuthStore';

const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,
    isConnectingToSocket: false,
    currentLobby: null,
    lobbyListenerEvents: null,
    connectSocket: createConnectSocket(set, get),
    disconnectSocket: createDisconnectSocket(set, get),
    setLobbyListenerEvents: createSetLobbyListenerEvents(set, get),
    createNewLobby: createCreateNewLobby(set, get),
    joinLobby: createJoinLobby(set, get),
    leaveLobby: createLeaveLobby(set, get),
    setLobby: createSetLobby(set),
    emitSetPlayerReady: createEmitSetPlayerReady(get),
    setPlayerReady: createSetPlayerReady(set, get),
    addNewPlayer: createAddNewPlayer(set, get),
    removePlayer: createRemovePlayer(set, get),
}));

function createConnectSocket(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return async () => {
        const { isConnectingToSocket, lobbyListenerEvents, setLobbyListenerEvents } = get();
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

function createCreateNewLobby(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return async (settings: LobbySettings) => {
        const { socket } = get();
        if (!socket) {
            return console.error('Could not create new lobby: socket not connected');
        }
        const { success, data, error } = lobbySettingsSchema.safeParse(settings);
        if (!success) {
            return console.error(error);
        }
        socket.emit('create_new_lobby', data, (response) => {
            const { success, message } = response;
            if (!success) {
                return console.error(message);
            }
            const newLobby = createLobby(response.data);
            set((state) => ({
                ...state,
                currentLobby: newLobby,
            }));
        });
    };
}

function createJoinLobby(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (lobby_id: string, password = '') => {
        const { socket, lobbyListenerEvents, currentLobby, addNewPlayer, removePlayer } = get();
        const { user } = useAuthStore.getState();
        if (!socket) {
            return console.error('Could not join lobby: no socket connected');
        }
        if (currentLobby) {
            if (!user) return console.error('Could not join lobby: user not found');
            const { settings, ...publicUser } = user;
            addNewPlayer({ ...publicUser, isReady: false });
        }
        socket.emit('join_lobby', { lobby_id, password }, (response) => {
            const { success, message } = response;
            if (!success) {
                if (currentLobby && user) {
                    removePlayer(user._id);
                }
                return console.error(message);
            }
            if (!lobbyListenerEvents) {
                return console.error('No lobby event listeners found');
            }
            const lobby = currentLobby ?? createLobby(response.data);
            socket.registerListenerEvents(lobbyListenerEvents);
            set((state) => ({
                ...state,
                currentLobby: lobby,
            }));
        });
    };
}

function createLeaveLobby(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return () => {
        const { socket, lobbyListenerEvents } = get();
        if (!socket) {
            return console.error('Could not leave lobby: no socket connected');
        }
        socket.emit('leave_lobby');
        if (lobbyListenerEvents) {
            socket.unregisterListenerEvents(lobbyListenerEvents);
        }
        set((state) => ({ ...state, lobbyListenerEvents: null, currentLobby: null }));
    };
}

function createSetLobby(set: SetFn<SocketState>) {
    return (lobby: ClientLobby) => {
        set((state) => ({ ...state, currentLobby: lobby }));
    };
}

function createEmitSetPlayerReady(get: GetFn<SocketStore>) {
    return (user_id: string) => {
        const { socket, setPlayerReady } = get();
        if (!socket) {
            throw new Error('Could not set player ready: socket not connected');
        }
        setPlayerReady(user_id);
        socket.emit('player_ready', (response) => {
            const { message, success } = response;
            if (!success) {
                console.error(message);
                return setPlayerReady(user_id);
            }
        });
    };
}

function createSetPlayerReady(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (user_id: string) => {
        const { currentLobby, socket } = get();
        if (!socket) {
            return console.error('Could not set player ready: socket not connected');
        }
        if (!currentLobby) {
            return console.error('Could not set player ready: lobby not found');
        }
        if (!isMultiplayerLobby(currentLobby)) {
            return console.error('Could not set player ready: lobby is not multiplayer');
        }
        if (user_id === currentLobby.leader) {
            return console.error('Could not set player ready: player is lobby leader');
        }
        set((state) => {
            currentLobby.setPlayerReady(user_id);
            return { ...state, currentLobby };
        });
    };
}

function createAddNewPlayer(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (player: PublicLobbyProfile) => {
        const { currentLobby } = get();
        if (!player) {
            return console.error('Could not add player to lobby: no player data provided');
        }
        set((state) => {
            if (!currentLobby) {
                console.error('Could not add player to lobby: no lobby found');
                return state;
            }
            if (!isMultiplayerLobby(currentLobby)) {
                console.error('Could not add player to lobby: lobby is not multiplayer');
                return state;
            }
            if (currentLobby.players.size >= currentLobby.settings.maxPlayers) {
                console.error('could not add player to lobby: max players reached');
                return state;
            }
            currentLobby.addNewPlayer(player);

            return {
                ...state,
                currentLobby,
            };
        });
    };
}

function createRemovePlayer(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return (user_id: string) => {
        const { currentLobby } = get();
        if (!user_id) {
            return console.error('Could not remove player from lobby: no player ID provided');
        }
        if (!currentLobby) {
            return console.error('Could not remove player form lobby: lobby not found');
        }
        if (!isMultiplayerLobby(currentLobby)) {
            return console.error('Could not remove player from lobby: lobby is not multiplayer');
        }
        set((state) => {
            currentLobby.removePlayer(user_id);
            return {
                ...state,
                currentLobby,
            };
        });
    };
}

function createSetLobbyListenerEvents(set: SetFn<SocketState>, get: GetFn<SocketStore>) {
    return () => {
        const { setPlayerReady, addNewPlayer, removePlayer } = get();
        const events: LobbyListenerEvents = {
            set_player_ready: (playerId: string) => setPlayerReady(playerId),
            add_new_player: (player: PublicLobbyProfile) => addNewPlayer(player),
            remove_player: (playerId: string) => removePlayer(playerId),
        };
        set((state) => ({
            ...state,
            lobbyListenerEvents: events,
        }));
    };
}

export default useSocketStore;
