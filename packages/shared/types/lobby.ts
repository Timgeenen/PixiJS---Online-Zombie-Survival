import { z } from 'zod';
import { baseLobbyBaseSchema, lobbySettingsSchema } from '../schemas';
import type { PublicLobbyProfile } from './user';

export type BlackList = Set<string>;
export type LobbySettings = z.infer<typeof lobbySettingsSchema>;
export type SafeLobbySettings = SoloLobbySettings | Omit<MultiplayerLobbySettings, 'password'>;
export type SoloLobbySettings = Extract<LobbySettings, { gameMode: 'solo' }>;
export type MultiplayerLobbySettings = Extract<LobbySettings, { gameMode: 'multiplayer' }>;
export type LobbyData = z.infer<typeof baseLobbyBaseSchema>;
export type SoloLobbyData = Pick<LobbyData, '_id' | 'inGame' | 'leader' | 'players'> & {
    settings: SoloLobbySettings;
};
export type MultiplayerLobbyData = Omit<LobbyData, 'settings'> & {
    settings: MultiplayerLobbySettings;
};
export type LobbyPlayerMap = Map<string, PublicLobbyProfile>;

export type JoinLobbyData = { lobby_id: string; password?: string };
