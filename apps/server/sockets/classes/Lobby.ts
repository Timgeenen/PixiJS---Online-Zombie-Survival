import {
    SocketAuthError,
    SocketConflictError,
    SocketError,
    SocketForbiddenError,
    SocketNotFoundError,
} from '@Errors/customSocketErrors';
import {
    Lobby,
    type BlackList,
    type LobbyData,
    type MultiplayerLobbyData,
    type MultiplayerLobbySettings,
    type PublicLobbyProfile,
    type SocketCallback,
    type SoloLobbyData,
    type SoloLobbySettings,
} from '@monorepo/shared';
import { comparePassword } from '@Utils/hash';
import logger from '@Utils/logger';

export type ServerLobby = ServerMultiplayerLobby | ServerSoloLobby;

export abstract class ServerLobbyBase extends Lobby {
    timeoutRef?: NodeJS.Timeout;

    constructor(lobbyData: LobbyData) {
        super(lobbyData);
    }

    public setLobbyTimeout(timeout: NodeJS.Timeout): void {
        if (this.timeoutRef) clearTimeout(this.timeoutRef);
        this.timeoutRef = timeout;
    }

    public clearLobbyTimeout(): void {
        if (this.timeoutRef) {
            return clearTimeout(this.timeoutRef);
        }
        logger.info('Could not clear timeout: no timer found');
    }

    public startLobby(user_id: string, callback?: SocketCallback): void {
        if (user_id !== this.leader) {
            throw new SocketForbiddenError(
                'Could not start lobby: user_id does not match leader id',
                callback && {
                    callback,
                    clientMessage: 'Could not start lobby: you are not the lobby leader',
                },
            );
        }
        this.inGame = true;
    }

    public isEmptyLobby(): boolean {
        return this.players.size === 0;
    }
    public isPlayerInLobby(user_id: string): boolean {
        return this.players.has(user_id);
    }
}

export class ServerMultiplayerLobby extends ServerLobbyBase {
    blackList: BlackList;
    override settings: Omit<MultiplayerLobbySettings, 'password'>;
    private readonly password?: string;

    constructor(lobbyData: MultiplayerLobbyData) {
        super(lobbyData);
        this.blackList = new Set();
        const { password, ...settings } = lobbyData.settings;
        if (settings.isPrivate) {
            if (!password) {
                throw new SocketError('Could not create new private lobby: password required');
            }
            this.password = password;
        }
        this.settings = settings;
    }

    public getLobbyResponseData(): MultiplayerLobbyData {
        return {
            _id: this._id,
            leader: this.leader,
            players: Object.fromEntries(this.players),
            settings: this.settings,
        };
    }

    public setPlayerReady(user_id: string, callback?: SocketCallback): void {
        const player = this.players.get(user_id);
        if (!player) {
            throw new SocketAuthError(
                'Could not find player in lobby',
                callback && { callback, clientMessage: 'Player not found' },
            );
        }
        player.isReady = !player.isReady;
    }

    public addNewPlayer(
        user: PublicLobbyProfile,
        password?: string,
        callback?: SocketCallback,
    ): void {
        if (this.isLobbyFull()) {
            throw new SocketConflictError(
                'Could not add player to lobby: lobby is full',
                callback && { callback, clientMessage: 'Lobby is full' },
            );
        }
        if (this.isPlayerInLobby(user._id)) {
            return;
        }
        if (this.isPlayerBanned(user._id)) {
            throw new SocketConflictError(
                'Could not add player to lobby: player was found in blacklist',
                callback && { callback, clientMessage: 'You have been banned from this lobby' },
            );
        }
        if (this.isPrivateLobby()) {
            if (!password) {
                throw new SocketForbiddenError(
                    'Could not add player to lobby: no password found',
                    callback && { callback, clientMessage: '' },
                );
            }
            this.isMatchingPassword(password);
        }
        this.players.set(user._id, user);
        this.clearLobbyTimeout();
    }

    public removePlayer(user_id: string, callback?: SocketCallback) {
        const deleted = this.players.delete(user_id);
        if (!deleted) {
            throw new SocketNotFoundError(
                'Could not remove player from lobby: player not found',
                callback && { callback, clientMessage: 'Player not found' },
            );
        }
        if (this.leader === user_id && !this.isEmptyLobby()) {
            this.setNewLeader(null, callback);
        }
    }

    public setNewLeader(user_id: string | null, callback?: SocketCallback): void {
        const newLeader = user_id ?? this.players.entries().next().value?.[1]._id;
        if (!newLeader) {
            throw new SocketConflictError(
                'Could not assign new leader: no valid ID found',
                callback && { callback, clientMessage: 'Could not assign new leader' },
            );
        }
    }

    private isMatchingPassword(password: string, callback?: SocketCallback): void {
        if (!this.password) {
            throw new SocketError(
                'Could not compare passwords: password not found in server lobby class instance',
                callback && { callback, clientMessage: 'Internal server error' },
            );
        }
        const match = comparePassword(password, this.password);
        if (!match) {
            throw new SocketConflictError(
                'Passwords do not match',
                callback && { callback, clientMessage: 'Invalid password' },
            );
        }
    }

    public allPlayersReady(): boolean {
        let allPlayersReady = true;
        for (const [_, player] of this.players) {
            if (this.leader === player._id) {
                continue;
            }
            if (!player.isReady) {
                allPlayersReady = false;
                break;
            }
        }
        return allPlayersReady;
    }
    public isLobbyFull(): boolean {
        return this.players.size >= this.settings.maxPlayers;
    }
    public isPrivateLobby(): boolean {
        return this.settings.isPrivate;
    }
    public isPlayerBanned(user_id: string): boolean {
        return this.blackList.has(user_id);
    }
}

export class ServerSoloLobby extends ServerLobbyBase {
    override readonly leader: string;
    override settings: SoloLobbySettings;
    constructor(lobbyData: SoloLobbyData) {
        super(lobbyData);
        this.leader = lobbyData.leader;
        this.settings = lobbyData.settings;
    }
    public getLobbyResponseData(): SoloLobbyData {
        return {
            _id: this._id,
            leader: this.leader,
            players: Object.fromEntries(this.players),
            settings: this.settings,
        };
    }

    public removePlayer(user_id: string, callback?: SocketCallback) {
        const deleted = this.players.delete(user_id);
        if (!deleted) {
            throw new SocketNotFoundError(
                'Could not remove player from lobby: player not found',
                callback && { callback, clientMessage: 'Player not found' },
            );
        }
    }

    public addNewPlayer(user: PublicLobbyProfile, password = '', callback?: SocketCallback): void {
        if (this.leader !== user._id) {
            throw new SocketConflictError(
                'Could not add player to solo lobby: invalid user id',
                callback && {
                    callback,
                    clientMessage: 'Could not join lobby',
                },
            );
        }
        if (this.isPlayerInLobby(user._id)) {
            throw new SocketConflictError(
                'Could not add player to lobby: player was already connected',
                callback && { callback, clientMessage: 'Could not join lobby' },
            );
        }
    }
}
