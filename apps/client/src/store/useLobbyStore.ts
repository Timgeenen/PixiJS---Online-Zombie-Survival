import type { LobbyListListenerEvents } from '@Library/socket/types';
import { lobbySettingsSchema, type LobbyListData, type LobbySettings, type PublicLobbyProfile } from '@monorepo/shared';
import type { GetFn, LobbyActions, LobbyState, LobbyStore, SetFn } from '@Types';
import {
    createLobby,
    isMultiplayerLobby,
    type ClientLobby,
} from 'src/features/lobby/classes/Lobby';
import { LobbyMap } from 'src/features/lobbyList/classes/LobbyMap';
import { create } from 'zustand';
import useAuthStore from './useAuthStore';
import useSocketStore from './useSocketStore';

const useLobbyStore = create<LobbyStore>((set, get) => ({
    currentLobby: null,
    lobbyMap: null,
    joinLobbyList: createJoinLobbyList(set),
    leaveLobbyList: createLeaveLobbyList(set),
    addLobbyToList: createAddLobbyToList(set, get),
    removeLobbyFromList: createRemoveLobbyFromList(set, get),
    updatePlayerCount: createUpdatePlayerCount(set, get),
    updateInGameStatus: createUpdateInGameStatus(set, get),

    createNewLobby: createCreateNewLobby(set),
    joinLobby: createJoinLobby(set, get),
    leaveLobby: createLeaveLobby(set),
    setLobby: createSetLobby(set),
    emitSetPlayerReady: createEmitSetPlayerReady(get),
    setPlayerReady: createSetPlayerReady(set, get),
    addNewPlayer: createAddNewPlayer(set, get),
    removePlayer: createRemovePlayer(set, get),
}));

function createJoinLobbyList(set: SetFn<LobbyState>): LobbyActions['joinLobbyList'] {
    return () => {
        const { socket, lobbyListListenerEvents } = useSocketStore.getState();
        if (!socket) {
            return console.error("Could not join lobby list: socket not connected");
        }
        socket.emit('join_lobby_list', (response) => {
            const { success, message } = response;
            if (!success) {
                return console.error(message);
            }
            if (!lobbyListListenerEvents) {
                return console.error('No lobby list listener events found')
            }
            socket.registerListenerEvents(lobbyListListenerEvents)
            set(state => ({
                ...state,
                lobbyMap: new LobbyMap(Object.entries(response.data))
            }))
        })
    }
}

function createLeaveLobbyList (set: SetFn<LobbyState>): LobbyActions['leaveLobbyList'] {
    return () => {
        const { socket, lobbyListListenerEvents } = useSocketStore.getState();
        if (!socket) {
            return console.error("Could not leave lobby list: socket not connected")
        }
        socket.emit('leave_lobby_list');
        if (lobbyListListenerEvents) {
            socket.unregisterListenerEvents(lobbyListListenerEvents)
        }
        set(state => ({
            ...state,
            lobbyMap: null
        }))
    }
}

function createAddLobbyToList(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyActions['addLobbyToList'] {
    return (lobby: LobbyListData) => {
        const { lobbyMap } = get();
        if (!lobbyMap) {
            return console.error('Could not add lobby to map: lobbyMap not found in lobby store');
        }
        lobbyMap.set(lobby._id, lobby);
        set(state => ({
            ...state,
            lobbyMap
        }))
    }
}

function createRemoveLobbyFromList(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyListListenerEvents['remove_lobby'] {
    return (lobby_id) => {
        const { lobbyMap } = get();
        if (!lobbyMap) {
            return console.error('Could not remove lobby from map: lobbyMap not found');
        }
        lobbyMap.delete(lobby_id);
        set(state => ({ ...state, lobbyMap }))
    }
}

function createUpdatePlayerCount(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyListListenerEvents['update_player_count'] {
    return (lobby_id, currentPlayers) => {
        const { lobbyMap } = get();
        if (!lobbyMap) {
            return console.error('Could not update player count: lobbyMap not found');
        }
        const lobby = lobbyMap.get(lobby_id);
        if (!lobby) {
            return console.error('Could not update player count: lobby not found in lobbyMap');
        }
        lobbyMap.set(lobby_id, { ...lobby, currentPlayers});
        set(state => ({ ...state, lobbyMap }))
    }

}

function createUpdateInGameStatus(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyListListenerEvents['update_inGame'] {
    return (lobby_id, inGame) => {
        const { lobbyMap } = get();
        if (!lobbyMap) {
            return console.error('Could not update game status: lobbyMap not found');
        }
        const lobby = lobbyMap.get(lobby_id);
        if (!lobby) {
            return console.error('Could not update game status: lobby not found in lobbyMap');
        }
        lobbyMap.set(lobby_id, {...lobby, inGame});
        set(state => ({ ...state, lobbyMap}));
    }
}


function createCreateNewLobby(set: SetFn<LobbyState>): LobbyActions['createNewLobby'] {
    return async (settings: LobbySettings) => {
        const { socket } = useSocketStore.getState();
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

function createJoinLobby(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyActions['joinLobby'] {
    return (lobby_id, password = '') => {
        const { currentLobby, addNewPlayer, removePlayer } = get();
        const { socket, lobbyListenerEvents } = useSocketStore.getState();
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

function createLeaveLobby(set: SetFn<LobbyState>): LobbyActions['leaveLobby'] {
    return () => {
        const { socket, lobbyListenerEvents } = useSocketStore.getState();
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

function createSetLobby(set: SetFn<LobbyState>): LobbyActions['setLobby'] {
    return (lobby: ClientLobby) => {
        set((state) => ({ ...state, currentLobby: lobby }));
    };
}

function createEmitSetPlayerReady(get: GetFn<LobbyStore>): LobbyActions['emitSetPlayerReady'] {
    return (user_id: string) => {
        const { setPlayerReady } = get();
        const { socket } = useSocketStore.getState();
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

function createSetPlayerReady(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyActions['setPlayerReady'] {
    return (user_id: string) => {
        const { currentLobby } = get();
        const { socket } = useSocketStore.getState();
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

function createAddNewPlayer(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyActions['addNewPlayer'] {
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

function createRemovePlayer(set: SetFn<LobbyState>, get: GetFn<LobbyStore>): LobbyActions['removePlayer'] {
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


export default useLobbyStore;
