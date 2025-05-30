import { z } from 'zod';
import type {
    baseLobbyBaseSchema,
    gameDifficultiesSchema,
    gameModesSchema,
    lobbySettingsSchema,
} from '../schemas';

export type GameDifficulties = z.infer<typeof gameDifficultiesSchema>;
export type GameModes = z.infer<typeof gameModesSchema>;
export type LobbySettings = z.infer<typeof lobbySettingsSchema>;
export type Lobby = z.infer<typeof baseLobbyBaseSchema>;
