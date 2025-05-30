import type {
    DBLobbyInputSchema,
    DBLobbyOutputSchema,
    DBUserInputSchema,
    DBUserOutputSchema,
} from 'schemas/db.schemas';
import { z } from 'zod';

export type DBLobbyInput = z.infer<typeof DBLobbyInputSchema>;
export type DBLobbyOutput = z.infer<typeof DBLobbyOutputSchema>;
export type DBUserInput = z.infer<typeof DBUserInputSchema>;
export type DBUserOutput = z.infer<typeof DBUserOutputSchema>;
