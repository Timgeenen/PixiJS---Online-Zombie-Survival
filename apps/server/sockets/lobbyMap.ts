import { SocketNotFoundError } from '@Errors/customSocketErrors';
import type { ServerLobby } from './classes/Lobby';
import type { SocketCallback } from '@monorepo/shared';
import { setRemoveLobbyTimeout } from './lobbyHandlers';
import logger from '@Utils/logger';

export default class LobbyMap extends Map<string, ServerLobby> {
    constructor(entries?: readonly (readonly [string, ServerLobby])[] | null) {
        super(entries ?? []);
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

    deleteLobby(lobby_id: string, callback?: SocketCallback): void {
        const lobby = this.getLobby(lobby_id, callback);
        logger.info('Setting delete lobby timeout');
        const timeout = setRemoveLobbyTimeout(lobby_id, this);
        lobby.setLobbyTimeout(timeout);
    }
}
