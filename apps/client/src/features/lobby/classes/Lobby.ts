import {
    Lobby,
    type BlackList,
    type LobbyData,
    type MultiplayerLobbyData,
    type MultiplayerLobbySettings,
    type PublicLobbyProfile,
    type SoloLobbyData,
    type SoloLobbySettings,
} from '@monorepo/shared';

export function createLobby(data: LobbyData): ClientLobby {
    if (isMultiplayerLobbyData(data)) {
        return new ClientMultiplayerLobby(data);
    }
    if (isSoloLobbyData(data)) {
        return new ClientSoloLobby(data);
    }
    throw new Error('Invalid lobby data');
}

export function isMultiplayerLobbyData(data: LobbyData): data is MultiplayerLobbyData {
    return data.settings.gameMode === 'multiplayer';
}
export function isSoloLobbyData(data: LobbyData): data is SoloLobbyData {
    return data.settings.gameMode === 'solo';
}

export function isMultiplayerLobby(lobby: ClientLobby): lobby is ClientMultiplayerLobby {
    return lobby.settings.gameMode === 'multiplayer';
}

export function isSoloLobby(lobby: ClientLobby): lobby is ClientSoloLobby {
    return lobby.settings.gameMode === 'solo';
}

export type ClientLobby = ClientMultiplayerLobby | ClientSoloLobby;

export class ClientLobbyBase extends Lobby {
    constructor(lobbyData: LobbyData) {
        super(lobbyData);
    }
}

export class ClientMultiplayerLobby extends ClientLobbyBase {
    override settings: Omit<MultiplayerLobbySettings, 'password'>;
    blackList: BlackList;
    constructor(lobbyData: MultiplayerLobbyData, blackList?: BlackList) {
        super(lobbyData);
        this.blackList = blackList ?? new Set();
        const { password, ...settings } = lobbyData.settings;
        if (settings.isPrivate) {
            if (!password) {
                throw new Error('Could not create new private lobby: password required');
            }
        }
        this.settings = settings;
    }

    setPlayerReady(user_id: string): void {
        const player = this.players.get(user_id);
        if (!player) {
            throw new Error('Player not found');
        }
        player.isReady = !player.isReady;
    }

    addNewPlayer(player: PublicLobbyProfile): void {
        if (this.isLobbyFull()) {
            throw new Error('Lobby is full');
        }
        if (this.isPlayerBanned(player._id)) {
            throw new Error('Player was banned');
        }
        if (this.isPlayerInLobby(player._id)) {
            throw new Error('Player is already connected to lobby');
        }

        this.players.set(player._id, player);
    }

    removePlayer(user_id: string): void {
        if (!this.players.delete(user_id)) {
            throw new Error('Player not found');
        }
        if (this.leader === user_id && this.players.size > 0) {
            this.setNewLeader();
        }
    }

    setNewLeader(user_id?: string): void {
        const newLeader = user_id ?? this.players.entries().next().value?.[1]._id;
        if (!newLeader) {
            throw new Error('Could not assign new leader');
        }
        this.leader = newLeader;
    }

    isLobbyFull(): boolean {
        return this.players.size >= this.settings.maxPlayers;
    }
    isPlayerBanned(user_id: string): boolean {
        return this.blackList.has(user_id);
    }
    isPlayerInLobby(user_id: string): boolean {
        return this.players.has(user_id);
    }
}

export class ClientSoloLobby extends ClientLobbyBase {
    override settings: SoloLobbySettings;
    constructor(lobbyData: SoloLobbyData) {
        super(lobbyData);
        this.settings = lobbyData.settings;
    }
}
