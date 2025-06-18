import { SocketNotFoundError } from '@Errors/customSocketErrors';
import type { ServerLobby } from './classes/Lobby';
import type { LobbyList, SocketCallback } from '@monorepo/shared';
import { setRemoveLobbyTimeout } from './lobbyHandlers';
import logger from '@Utils/logger';
import { isMultiplayerLobby } from './socketEventHelpers';
import type { Socket } from 'socket.io';

export default class LobbyMap extends Map<string, ServerLobby> {
    constructor(entries?: readonly (readonly [string, ServerLobby])[] | null) {
        super(entries ?? []);
    }

    getLobbyList(): LobbyList {
        const lobbies: LobbyList = {}
        this.forEach(lobby => {
            if (!isMultiplayerLobby(lobby)) { return }
            lobbies[lobby._id] = {
                _id: lobby._id,
                settings: lobby.settings,
                currentPlayers: lobby.players.size
            }
        })
        return lobbies;
    }

    getLobby(lobby_id: string, callback?: SocketCallback): ServerLobby {
        const lobby = this.get(lobby_id);
        if (!lobby) {
            throw new SocketNotFoundError(
                'Could not find lobby in socket map',
                callback && { callback, clientMessage: 'Lobby not found' },
            );
        }
        return lobby;
    }

    deleteLobby(lobby_id: string, socket: Socket, callback?: SocketCallback): void {
        const lobby = this.getLobby(lobby_id, callback);
        logger.info('Setting delete lobby timeout');
        const timeout = setRemoveLobbyTimeout(lobby_id, this, socket);
        lobby.setLobbyTimeout(timeout);
    }
}
