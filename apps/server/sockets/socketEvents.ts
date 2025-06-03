import type {
    SocketJoinLobbyData,
    SocketJoinLobbyResponse,
    SocketLeaveLobbyData,
} from '@monorepo/shared';
import { comparePassword } from '@Utils/hash';
import logger from '@Utils/logger';
import { findLobbyById, joinLobby } from 'services/lobbyService';
import { findUserById } from 'services/userService';
import type { Socket } from 'socket.io';

export function createJoinSocketRoom(socket: Socket) {
    return async (
        { lobbyId, password }: SocketJoinLobbyData,
        callback: (response: SocketJoinLobbyResponse) => void,
    ) => {
        const lobby = await findLobbyById(lobbyId);
        if (!lobby) {
            logger.error('Lobby does not exist');
            return callback({ success: false, message: 'Lobby does not exist' });
        }
        if (lobby.settings.gameMode === 'solo') {
            logger.error('Requested lobby has game mode set to solo');
            return callback({
                success: false,
                message: 'Requested lobby has game mode set to solo',
            });
        }
        if (!!lobby.blackList?.find((playerId) => playerId === socket.data.user_id)) {
            logger.error('Player has been blacklisted for this lobby');
        }

        if (lobby.players.length >= lobby.settings.maxPlayers) {
            logger.error('Requested lobby already has max number of players');
            return callback({ success: false, message: 'Lobby is full' });
        }

        if (lobby.settings.isPrivate) {
            if (!password) {
                logger.error('No password provided for private lobby');
                return callback({ success: false, message: '' });
            }
            const match = await comparePassword(password, lobby.settings.password!);
            if (!match) {
                logger.error('Passwords do not match');
                return callback({ success: false, message: 'Invalid password' });
            }
        }

        const user = await findUserById(socket.data.user_id);
        if (!user) {
            logger.error('Invalid user ID');
            return callback({ success: false, message: 'Invalid user' });
        }

        const joined = await joinLobby(lobbyId, {
            _id: user._id,
            username: user.username,
            stats: user.stats,
        });
        if (!joined) {
            logger.error('Error occurred while updating lobby players array');
            return callback({ success: false, message: 'Could not join lobby' });
        }

        socket.join(`lobby: ${lobbyId}`);
        logger.info(`joined lobby`);
        return callback({
            success: true,
            message: `Successfully joined room: ${lobbyId}`,
            data: joined,
        });
    };
}

export function createLeaveSocketRoom(socket: Socket) {
    return async (
        { lobbyId }: SocketLeaveLobbyData,
        callback: (response: SocketJoinLobbyResponse) => void,
    ) => {};
}
