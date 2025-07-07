import { z } from 'zod';

export const gameSettingsSchema = z.object({
    shootOnAim: z.boolean(),
});

export const keybindingsSchema = z.object({
    up: z.string(),
    down: z.string(),
    left: z.string(),
    right: z.string(),
    aimUp: z.string(),
    aimDown: z.string(),
    aimLeft: z.string(),
    aimRight: z.string(),
    shoot: z.string(),
    nextWeapon: z.string(),
    prevWeapon: z.string(),
    reload: z.string(),
});

export const playerSettings = z.object({
    gameSettings: gameSettingsSchema,
    keybindings: keybindingsSchema,
});

// const lobbySchema = z.object({
//     gameSettings: gameSettingsSchema,
//     started: z.boolean()
// })
