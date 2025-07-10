import { SocketAuthError } from '@Errors/customSocketErrors';
import type { Entity } from '@monorepo/shared';
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

export function setPlayerEntity(socket: Socket, entity: Entity): void {
    socket.data.player_entity = entity;
}

export function getPlayerEntity(socket: Socket): Entity {
    return socket.data.player_entity;
}

export function removePlayerEntity(socket: Socket): void {
    delete socket.data.player_entity;
}
