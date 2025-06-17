import { SocketAuthError } from '@Errors/customSocketErrors';
import logger from '@Utils/logger';
import type { Socket } from 'socket.io';

export function setUserId(socket: Socket, user_id: string): void {
    socket.data.user_id = user_id;
}

export function getUserId(socket: Socket, callback?: (...args: any[]) => void): string {
    const user_id = socket.data.user_id;
    if (!user_id) {
        throw new SocketAuthError(
            'Could not find user_id in socket data',
            callback && {
                callback,
                clientMessage: 'User not found',
            },
        );
    }
    return user_id;
}

export function removeUserId(socket: Socket): void {
    delete socket.data.user_id;
}

export function setLobbyId(socket: Socket, lobby_id: string): void {
    socket.data.lobby_id = lobby_id;
}

export function getLobbyId(socket: Socket): string {
    return socket.data.lobby_id;
}

export function removeLobbyId(socket: Socket): void {
    delete socket.data.lobby_id;
}
