import { baseLobbyBaseSchema, myProfileSchema, registerCredentialsSchema } from '@monorepo/shared';
import { z } from 'zod';

export const metaDataSchema = z.object({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
});

export const DBLobbyOutputSchema = baseLobbyBaseSchema.extend(metaDataSchema.shape);
export const DBLobbyInputSchema = baseLobbyBaseSchema.superRefine((data, ctx) => {
    if (
        data.settings.gameMode === 'multiplayer' &&
        data.players.length > data.settings.maxPlayers
    ) {
        ctx.addIssue({
            path: ['players'],
            code: z.ZodIssueCode.custom,
            message: `Too many players. Max ${data.settings.maxPlayers}`,
        });
    }
});

export const DBUserInputSchema = myProfileSchema.extend(registerCredentialsSchema.shape);
export const DBUserOutputSchema = myProfileSchema.extend(metaDataSchema.shape);
