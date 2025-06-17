import { z } from 'zod';
import type { gameDifficultiesSchema, gameModesSchema } from '../schemas';

export type GameDifficulties = z.infer<typeof gameDifficultiesSchema>;
export type GameModes = z.infer<typeof gameModesSchema>;
