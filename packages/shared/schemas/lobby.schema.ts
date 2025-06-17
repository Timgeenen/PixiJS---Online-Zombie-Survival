import { z } from 'zod';
import { lobbySettingsSchema } from './settings.schema';
import { lobbyProfileSchema } from './user.schema';

export const baseLobbyBaseSchema = z.object({
    _id: z.string(),
    leader: z.string(),
    players: z.record(z.string(), lobbyProfileSchema),
    inGame: z.boolean().optional(),
    blackList: z.set(z.string()).optional(),
    settings: lobbySettingsSchema,
});
