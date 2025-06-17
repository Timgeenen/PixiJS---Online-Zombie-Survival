import { z } from 'zod';
import {
    MAX_LOBBY_NAME_LENGTH,
    MAX_LOBBY_PASSWORD_LENGTH,
    MAX_PLAYER_LIMIT,
    MIN_LOBBY_NAME_LENGTH,
    MIN_LOBBY_PASSWORD_LENGTH,
} from '../constants';
import { gameDifficultiesSchema } from './game.schema';

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
});

export const playerSettings = z.object({
    gameSettings: gameSettingsSchema,
    keybindings: keybindingsSchema,
});

// const lobbySchema = z.object({
//     gameSettings: gameSettingsSchema,
//     started: z.boolean()
// })

const baseLobbySettingsSchema = z.object({
    difficulty: gameDifficultiesSchema,
});
export const soloLobbySettingsSchema = baseLobbySettingsSchema.extend({
    gameMode: z.literal('solo'),
});
export const multiplayerLobbySettingsSchema = baseLobbySettingsSchema.extend({
    gameMode: z.literal('multiplayer'),
    lobbyName: z.string().trim().min(MIN_LOBBY_NAME_LENGTH).max(MAX_LOBBY_NAME_LENGTH),
    maxPlayers: z.number().gte(2).lte(MAX_PLAYER_LIMIT),
    isPrivate: z.boolean(),
    password: z.string().trim().optional(),
});
const rawLobbySettingsSchema = z.discriminatedUnion('gameMode', [
    soloLobbySettingsSchema,
    multiplayerLobbySettingsSchema,
]);
export const lobbySettingsSchema = rawLobbySettingsSchema.refine(
    (data) => {
        if (data.gameMode === 'multiplayer' && data.isPrivate) {
            if (!data.password) {
                return false;
            }
            const trimmed = data.password.trim();
            return (
                trimmed.length >= MIN_LOBBY_PASSWORD_LENGTH &&
                trimmed.length <= MAX_LOBBY_PASSWORD_LENGTH
            );
        }
        return true;
    },
    {
        path: ['password'],
        message: `Password has to be between ${MIN_LOBBY_PASSWORD_LENGTH} and ${MAX_LOBBY_PASSWORD_LENGTH} characters`,
    },
);
