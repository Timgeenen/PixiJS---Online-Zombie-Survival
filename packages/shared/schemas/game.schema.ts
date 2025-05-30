import { z } from 'zod';

export const gameDifficultiesSchema = z.enum(['easy', 'normal', 'hard']);
export const gameModesSchema = z.enum(['solo', 'multiplayer']);
