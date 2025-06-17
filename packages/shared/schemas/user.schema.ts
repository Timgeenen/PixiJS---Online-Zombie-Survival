import { z } from 'zod';
import {
    MAX_PLAYER_LEVEL,
    MAX_USER_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_USER_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
} from '../constants';
import { playerSettings } from './settings.schema';

export const loginCredentialsSchema = z.object({
    username: z.string().max(MAX_USERNAME_LENGTH).min(MIN_USERNAME_LENGTH),
    password: z.string().max(MAX_USER_PASSWORD_LENGTH).min(MIN_USER_PASSWORD_LENGTH),
});

export const registerCredentialsSchema = loginCredentialsSchema.extend({
    email: z.string().email(),
});

export const profileStats = z.object({
    level: z.number().min(1).max(MAX_PLAYER_LEVEL),
    experience: z.number().min(0),
});

export const publicProfileSchema = z.object({
    _id: z.string(),
    username: z.string().max(MAX_USERNAME_LENGTH).min(MIN_USERNAME_LENGTH),
    stats: profileStats,
});

export const lobbyProfileSchema = publicProfileSchema.extend({
    isReady: z.boolean(),
});

export const myProfileSchema = publicProfileSchema.extend({
    settings: playerSettings,
});
