import { ZodError } from 'zod';
import { baseLobbyBaseSchema } from '../schemas';
import type { LobbyData, LobbyPlayerMap, LobbySettings } from '../types';

export abstract class Lobby {
    readonly _id: string;
    leader: string;
    settings: LobbySettings;
    players: LobbyPlayerMap;
    inGame: boolean;
    constructor(lobbyData: LobbyData) {
        const parsed = baseLobbyBaseSchema.safeParse(lobbyData);
        if (!parsed.success) {
            throw new ZodError(parsed.error.errors);
        }
        const { _id, leader, settings, players } = parsed.data;
        this._id = _id;
        this.leader = leader;
        this.settings = settings;
        this.players = new Map(Object.entries(players));
        this.inGame = lobbyData.inGame ?? false;
    }
}
