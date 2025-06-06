import type {
    SocketJoinLobbyData,
    SocketJoinLobbyResponse,
    SocketLeaveLobbyData,
} from '@monorepo/shared';
import { comparePassword } from '@Utils/hash';
import logger from '@Utils/logger';
import {
    SocketAuthError,
    SocketConflictError,
    SocketError,
    SocketForbiddenError,
    SocketNotFoundError,
} from 'errors/customSocketErrors';
import {
    findLobbyById,
    joinLobbyById,
    leaveLobbyById,
    removeLobbyById,
} from 'services/lobbyService';
import { findUserById } from 'services/userService';
import { Socket } from 'socket.io';

export function createJoinSocketLobby(socket: Socket) {
    return async (
        { lobbyId, password }: SocketJoinLobbyData,
        callback: (response: SocketJoinLobbyResponse) => void,
    ) => {
        logger.info('Join lobby request received');
        const lobby = await findLobbyById(lobbyId);
        if (!lobby) {
            throw new SocketNotFoundError('Lobby ID not found in database', {
                callback,
                clientMessage: 'Lobby not found',
            });
        }
        if (lobby.settings.gameMode === 'solo') {
            throw new SocketNotFoundError(
                'Could not join lobby: requested lobby has gamemode set to solo',
            );
        }
        if (!!lobby.blackList?.find((playerId) => playerId === socket.data.user_id)) {
            throw new SocketForbiddenError(
                'Could not join lobby: blacklisted in the requested lobby',
                { callback, clientMessage: 'Could not join lobby' },
            );
        }

        if (lobby.players.length >= lobby.settings.maxPlayers) {
            throw new SocketConflictError('Could not join lobby: lobby is full', {
                callback,
                clientMessage: 'Lobby is full',
            });
        }

        if (lobby.settings.isPrivate) {
            if (!password) {
                throw new SocketAuthError('Could not join lobby: missing password', {
                    callback,
                    clientMessage: 'Invalid password',
                });
            }
            const match = await comparePassword(password, lobby.settings.password!);
            if (!match) {
                throw new SocketAuthError('Could not join lobby: invalid password', {
                    callback,
                    clientMessage: 'Invalid password',
                });
            }
        }

        const user = await findUserById(socket.data.user_id);
        if (!user) {
            throw new SocketAuthError('Could not join lobby: invalid user ID', {
                callback,
                clientMessage: 'Invalid user',
            });
        }

        const joined = await joinLobbyById(lobbyId, {
            _id: user._id,
            username: user.username,
            stats: user.stats,
        });
        if (!joined) {
            throw new SocketError('Could not join lobby: error while updating database document', {
                callback,
                clientMessage: 'Server error',
            });
        }

        socket.join(lobbyId);
        logger.info(`Successfully joined lobby`);
        return callback({
            success: true,
            message: `Successfully joined lobby: ${lobbyId}`,
            data: joined,
        });
    };
}

export function createLeaveSocketLobby(socket: Socket) {
    return async ({ lobbyId }: SocketLeaveLobbyData) => {
        const lobby = await leaveLobbyById(lobbyId, socket.data.user_id);
        if (!lobby) {
            throw new SocketNotFoundError('Could not remove user from lobby: invalid lobby ID');
        }

        //remove lobby from database after delay if no users are connected anymore
        setTimeout(async () => {
            logger.info('Attempting to remove lobby from database');
            const lobby = await findLobbyById(lobbyId);
            if (!lobby) {
                throw new SocketNotFoundError(
                    'Could not remove lobby from database: invalid lobby ID',
                );
            }
            if (lobby.players.length <= 0) {
                const result = await removeLobbyById(lobbyId);
                if (!result) {
                    throw new SocketError('Could not remove lobby from database: database error');
                }
                return logger.info('Lobby has been removed from database');
            }
            logger.info('Removing lobby from database failed: more that 1 player connected');
        }, 10000);

        socket.leave(lobbyId);
    };
}
