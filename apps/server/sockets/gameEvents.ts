import {
    SocketAuthError,
    SocketBadRequestError,
    SocketNotFoundError,
} from '@Errors/customSocketErrors';
import {
    clientDataSchema,
    type ClientData,
    type GameState,
    type ServerPacket,
    type ServerTickData,
    type SocketResponse,
} from '@monorepo/shared';
import logger from '@Utils/logger';
import type { Server, Socket } from 'socket.io';
import type { GameMap } from './gameMap';
import { getLobbyId, getPlayerEntity, getUserId, setPlayerEntity } from './socketData';
import type { SocketInstance } from '.';
import type { ServerGame } from './classes/ServerGame';
import { startGameLoop } from './gameHandlers';

export function createInitializeGame(
    socket: Socket,
    gameMap: GameMap,
): (callback: (response: SocketResponse<GameState>) => void) => void {
    return (callback) => {
        logger.info('Initializing game');
        const user_id = getUserId(socket);
        const lobby_id = getLobbyId(socket);
        const game = gameMap.get(lobby_id);
        if (!game) {
            throw new SocketNotFoundError('Could not initialize game: game not found in gameMap', {
                callback,
                clientMessage: 'Could not fetch game state: game not found',
            });
        }
        let userInGame = false;
        for (const [entity, player] of game.playerMap) {
            if (player._id === user_id) {
                setPlayerEntity(socket, entity);
                userInGame = true;
                break;
            }
        }
        if (!userInGame) {
            throw new SocketAuthError(
                'Could not initialize game: user_id not found in player map',
                { callback, clientMessage: 'Could not fetch game state: unauthorized access' },
            );
        }
        const gameState = game.getState();
        socket.join(`game_${lobby_id}`);
        logger.info('Successfully initialized game: sending gamestate to client');
        callback({
            success: true,
            message: 'Initializing game',
            data: gameState,
        });
    };
}

export function createGameReady(
    socket: Socket,
    io: Server,
    gameMap: GameMap,
): (callback: (response: SocketResponse<undefined>) => void) => void {
    return (callback) => {
        logger.info('Setting player ready status in game');
        const lobby_id = getLobbyId(socket);
        const player_entity = getPlayerEntity(socket);
        const game = gameMap.get(lobby_id);
        if (!game) {
            throw new SocketNotFoundError('Could not set player connected: game not found', {
                callback,
                clientMessage: 'Game not found',
            });
        }
        const player = game.playerMap.get(player_entity);
        if (!player) {
            throw new SocketNotFoundError(
                'Could not set player connected: player not found in game',
                { callback, clientMessage: 'Player not found in game' },
            );
        }
        game.playerMap.set(player_entity, { ...player, isReady: true });
        let allPlayersReady = true;
        for (const [_, player] of game.playerMap) {
            if (!player.isReady) {
                allPlayersReady = false;
                break;
            }
        }
        if (allPlayersReady) {
            logger.info('starting game loop');
            startGameLoop(game, createSendGameUpdate(socket, io));
            const serverTickData = game.getServerTickData();
            io.to(`game_${lobby_id}`).emit('game_start', serverTickData);
        }
        callback({ message: 'successfully set player ready', success: true, data: undefined });
    };
}

export function createSendGameUpdate(socket: Socket, io: Server): (packet: ServerPacket) => void {
    const lobby_id = getLobbyId(socket);
    return (packet) => {
        io.to(`game_${lobby_id}`).emit('game_update', packet);
    };
}

export function createUpdateGame(
    socket: Socket,
    gameMap: GameMap,
): (clientData: ClientData) => void {
    return (clientData) => {
        const { data, error } = clientDataSchema.safeParse(clientData);
        if (error) {
            throw new SocketBadRequestError('Could not update game: invalid client data');
        }
        const player_entity = getPlayerEntity(socket);
        const lobby_id = getLobbyId(socket);
        const game = gameMap.get(lobby_id);
        if (!game) {
            throw new SocketNotFoundError('Could not update game: game not found in socket map');
        }
        game.systems.inputSystem.snapshots.set(player_entity, data.snapshots);
    };
}

export function createPing(
    socket: Socket,
    gameMap: GameMap,
): (callback: (response: SocketResponse<ServerTickData>) => void) => void {
    return (callback) => {
        const lobby_id = getLobbyId(socket);
        const game = gameMap.get(lobby_id);
        if (!game) {
            throw new SocketNotFoundError('Could not get socket tick data: game not found');
        }
        const data = game.getServerTickData();
        callback({ success: true, message: 'ping success', data });
    };
}
