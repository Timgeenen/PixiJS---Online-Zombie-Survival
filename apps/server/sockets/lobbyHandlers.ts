import { SocketError, SocketNotFoundError } from '@Errors/customSocketErrors';
import logger from '@Utils/logger';
import { findLobbyById, removeLobbyById } from 'services/lobbyService';
import type LobbyMap from './lobbyMap';
import type { Socket } from 'socket.io';

export function setRemoveLobbyTimeout(lobby_id: string, lobbyMap: LobbyMap, socket: Socket): NodeJS.Timeout {
    return setTimeout(async () => {
        logger.info('Attempting to remove lobby from database');
        if (!(await findLobbyById(lobby_id))) {
            throw new SocketNotFoundError('Could not remove lobby from database: invalid lobby ID');
        }
        const lobby = lobbyMap.getLobby(lobby_id);
        if (lobby.players.size <= 0) {
            const result = await removeLobbyById(lobby_id);
            lobby.clearLobbyTimeout();
            lobbyMap.delete(lobby_id);
            socket.to('lobby_list').emit('remove_lobby', lobby_id);
            if (!result) {
                throw new SocketError('Could not remove lobby from database: database error');
            }
            return logger.info('Lobby has been removed from database');
        }
        logger.info('Removing lobby from database failed: more that 1 player connected');
    }, 10000);
}
