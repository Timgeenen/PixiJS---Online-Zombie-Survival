import {
    type JoinLobbyData,
    type LobbyData,
    type LobbySettings,
    type PublicLobbyProfile,
    type SocketResponse,
} from '@monorepo/shared';
import logger from '@Utils/logger';
import { SocketAuthError, SocketConflictError, SocketError } from 'errors/customSocketErrors';
import { createNewLobby } from 'services/lobbyService';
import { findUserById } from 'services/userService';
import { Socket } from 'socket.io';
import { z } from 'zod';
import type LobbyMap from './lobbyMap';
import { getLobbyId, getUserId, removeLobbyId, setLobbyId } from './socketData';
import {
    handleCreateLobby,
    hashLobbyPassword,
    isMultiplayerLobby,
    isMultiplayerSettings,
    isSoloLobby,
    validateLobbySettings,
} from './socketEventHelpers';

export function createCreateNewSocketLobby(
    socket: Socket,
    lobbyMap: LobbyMap,
): (lobbySettings: LobbySettings, callback: (response: SocketResponse<LobbyData>) => void) => void {
    return async (lobbySettings, callback): Promise<void> => {
        logger.info('Socket event received: creating new lobby');
        const user_id = getUserId(socket, callback);
        const settings = validateLobbySettings(lobbySettings, callback);

        if (isMultiplayerSettings(settings) && settings.isPrivate) {
            if (!settings.password) {
                throw new SocketConflictError(
                    'Could not create private lobby: password is required',
                    { callback, clientMessage: 'Invalid password' },
                );
            }
            settings.password = hashLobbyPassword(settings.password, callback);
        }
        const databaseLobby = await createNewLobby({ settings });
        if (!databaseLobby) {
            throw new SocketError('Database error: could not create lobby', {
                callback,
                clientMessage: 'Could not create lobby',
            });
        }

        const lobby = await handleCreateLobby(databaseLobby, user_id, callback);
        lobbyMap.set(lobby._id, lobby);
        setLobbyId(socket, lobby._id);
        const lobbyData: LobbyData = lobby.getLobbyResponseData();
        logger.info('Successfully created new lobby');
        return callback({
            success: true,
            message: 'Successfully created new lobby',
            data: lobbyData,
        });
    };
}

export function createJoinSocketLobby(
    socket: Socket,
    lobbyMap: LobbyMap,
): (data: JoinLobbyData, callback: (response: SocketResponse<LobbyData>) => void) => void {
    return async (data, callback): Promise<void> => {
        logger.info('Join lobby request received');
        const result = z
            .object({
                lobby_id: z.string().trim(),
                password: z.string().trim().optional(),
            })
            .safeParse(data);
        if (!result.success) {
            throw new SocketError(result.error.message, {
                callback,
                clientMessage: 'Could not join lobby',
            });
        }
        const { lobby_id, password } = result.data;
        const user_id = getUserId(socket, callback);
        const lobby = lobbyMap.getLobby(lobby_id, callback);
        if (!isMultiplayerLobby(lobby) && lobby.leader !== user_id) {
            throw new SocketConflictError(
                'Could not join lobby: requested lobby game mode is solo',
                { callback, clientMessage: 'Could not join lobby' },
            );
        }
        const user = await findUserById(user_id);
        if (!user) {
            throw new SocketAuthError(`Could not join lobby: invalid player id: ${user_id}`);
        }

        const userProfile: PublicLobbyProfile = {
            _id: user_id,
            username: user.username,
            stats: user.stats,
            isReady: false,
        };
        lobby.addNewPlayer(userProfile, password, callback);
        await socket.join(lobby_id);
        setLobbyId(socket, lobby_id);
        socket.broadcast.to(lobby_id).emit('add_new_player', userProfile);
        const lobbyData = lobby.getLobbyResponseData();
        logger.info(`Successfully joined lobby`);
        return callback({
            success: true,
            message: `Successfully joined lobby: ${lobby_id}`,
            data: lobbyData,
        });
    };
}

export function createLeaveSocketLobby(socket: Socket, lobbyMap: LobbyMap): () => void {
    return (): void => {
        const lobby_id = getLobbyId(socket);
        const user_id = getUserId(socket);
        logger.info(`Leaving lobby: ${lobby_id}`);
        const lobby = lobbyMap.getLobby(lobby_id);
        lobby.removePlayer(user_id);
        if ((isMultiplayerLobby(lobby) && lobby.isEmptyLobby()) || isSoloLobby(lobby)) {
            lobbyMap.deleteLobby(lobby_id);
        }
        socket.broadcast.to(lobby_id).emit('remove_player', user_id);
        socket.leave(lobby_id);
    };
}

export function createSetPlayerReady(socket: Socket, lobbies: LobbyMap) {
    return (callback: (response: SocketResponse<null>) => void): void => {
        logger.info('Set player ready socket event received');
        const lobby_id = getLobbyId(socket);
        const user_id = getUserId(socket, callback);
        const lobby = lobbies.getLobby(lobby_id, callback);
        if (!isMultiplayerLobby(lobby)) {
            throw new SocketConflictError(
                'Could not set player ready: invalid event for solo lobby',
                { callback, clientMessage: 'Invalid request' },
            );
        }
        lobby.setPlayerReady(user_id, callback);
        socket.broadcast.to(lobby_id).emit('set_player_ready', user_id);
        logger.info('Set player ready success');
        callback({ success: true, message: 'Player has been updated', data: null });
    };
}
