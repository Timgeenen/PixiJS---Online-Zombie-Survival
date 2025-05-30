import { z } from 'zod';
import { MAX_PLAYER_LIMIT } from '../constants';
import { publicProfileSchema } from './user.schema';
import { lobbySettingsSchema } from './settings.schema';

export const baseLobbyBaseSchema = z.object({
    _id: z.string().optional(),
    leader: z.string(),
    players: z.array(publicProfileSchema).min(1).max(MAX_PLAYER_LIMIT),
    inGame: z.boolean().optional(),
    blackList: z.array(z.string()).optional(),
    settings: lobbySettingsSchema,
});
