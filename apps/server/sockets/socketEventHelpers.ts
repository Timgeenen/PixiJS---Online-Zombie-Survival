import { SocketError } from '@Errors/customSocketErrors';
import {
    lobbySettingsSchema,
    type LobbySettings,
    type MultiplayerLobbySettings,
    type SocketCallback,
    type SoloLobbySettings,
} from '@monorepo/shared';
import type { DBLobby } from '@Types/db';
import bcrypt from 'bcryptjs';
import { removeLobbyById } from 'services/lobbyService';
import { ServerMultiplayerLobby, ServerSoloLobby, type ServerLobby } from './classes/Lobby';
import logger from '@Utils/logger';

export function validateLobbySettings(
    settings: LobbySettings,
    callback?: SocketCallback,
): LobbySettings {
    const result = lobbySettingsSchema.safeParse(settings);
    if (!result.success) {
        throw new SocketError(
            result.error.message,
            callback && {
                callback,
                clientMessage: 'Invalid data',
            },
        );
    }
    return result.data;
}

export async function handleCreateLobby(
    databaseLobby: DBLobby,
    user_id: string,
    callback?: SocketCallback,
): Promise<ServerLobby> {
    let lobby: ServerLobby;
    const socketLobbyData = {
        _id: databaseLobby._id,
        leader: user_id,
        players: {},
    };
    if (isMultiplayerSettings(databaseLobby.settings)) {
        logger.info('New instance of ServerMultiplayerLobby has been created');
        lobby = new ServerMultiplayerLobby({
            ...socketLobbyData,
            settings: databaseLobby.settings,
        });
    } else if (isSoloSettings(databaseLobby.settings)) {
        logger.info('New instance of ServerSoloLobby has been created');
        lobby = new ServerSoloLobby({
            ...socketLobbyData,
            settings: databaseLobby.settings,
        });
    } else {
        const result = await removeLobbyById(databaseLobby._id);
        throw new SocketError(
            `Could not create new lobby: invalid gameMode => cleanup ${result ? 'success' : 'failed, lobby remains in database'}`,
            callback && {
                callback,
                clientMessage: 'Invalid game mode',
            },
        );
    }
    return lobby;
}

export function isMultiplayerSettings(
    lobbySettings: LobbySettings,
): lobbySettings is MultiplayerLobbySettings {
    return lobbySettings.gameMode === 'multiplayer';
}
export function isSoloSettings(lobbySettings: LobbySettings): lobbySettings is SoloLobbySettings {
    return lobbySettings.gameMode === 'solo';
}
export function isMultiplayerLobby(lobby: ServerLobby): lobby is ServerMultiplayerLobby {
    return lobby.settings.gameMode === 'multiplayer';
}
export function isSoloLobby(lobby: ServerLobby): lobby is ServerSoloLobby {
    return lobby.settings.gameMode === 'solo';
}

export function hashLobbyPassword(password: string, callback?: SocketCallback): string {
    try {
        const salt = bcrypt.genSaltSync(2);
        return bcrypt.hashSync(password, salt);
    } catch (error) {
        throw new SocketError(
            'Error occurred while encrypting lobby password',
            callback && { callback, clientMessage: 'Internal server error' },
        );
    }
}

export function compareLobbyPassword(
    password: string,
    hash: string,
    callback?: SocketCallback,
): boolean {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (error) {
        throw new SocketError(
            'Error occured while decrypting lobby password',
            callback && { callback, clientMessage: 'Internal server error' },
        );
    }
}
