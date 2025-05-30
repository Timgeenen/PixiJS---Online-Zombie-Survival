import type { z } from 'zod';
import type { keybindingsSchema, gameSettingsSchema, playerSettings } from '../schemas';

export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type Keybindings = z.infer<typeof keybindingsSchema>;
export type PlayerSettings = z.infer<typeof playerSettings>;
