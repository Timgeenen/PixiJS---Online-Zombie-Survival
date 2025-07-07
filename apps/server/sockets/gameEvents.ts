import type { GameState, SocketResponse } from '@monorepo/shared';
import type { Socket } from 'socket.io';
import type { GameMap } from './gameMap';
import { getLobbyId, getUserId } from './socketData';
import { SocketAuthError, SocketNotFoundError } from '@Errors/customSocketErrors';
import logger from '@Utils/logger';

export function createInitializeGame(
    socket: Socket,
    gameMap: GameMap,
): (callback: (response: SocketResponse<GameState>) => void) => void {
    return (callback) => {
        logger.info('Initializing game');
        const user_id = getUserId(socket);
        const lobby_id = getLobbyId(socket);
        if (!lobby_id) {
            throw new SocketNotFoundError(
                'Could not initialize game: lobby_id not found in socket',
                { callback, clientMessage: 'Could not fetch game state: game not found' },
            );
        }
        const game = gameMap.get(lobby_id);
        if (!game) {
            throw new SocketNotFoundError('Could not initialize game: game not found in gameMap', {
                callback,
                clientMessage: 'Could not fetch game state: game not found',
            });
        }
        let userInGame = false;
        game.playerMap.forEach((player) => {
            if (player._id === user_id) {
                return (userInGame = true);
            }
        });
        if (!userInGame) {
            throw new SocketAuthError(
                'Could not initialize game: user_id not found in player map',
                { callback, clientMessage: 'Could not fetch game state: unauthorized access' },
            );
        }
        const gameState = game.getState();
        logger.info('Successfully initialized game: sending gamestate to client');
        callback({
            success: true,
            message: 'Initializing game',
            data: gameState,
        });
    };
}
