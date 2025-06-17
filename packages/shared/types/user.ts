import type { z } from 'zod';
import type {
    lobbyProfileSchema,
    loginCredentialsSchema,
    myProfileSchema,
    profileStats,
    publicProfileSchema,
    registerCredentialsSchema,
} from '../schemas';

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type PublicProfile = z.infer<typeof publicProfileSchema>;
export type PublicLobbyProfile = z.infer<typeof lobbyProfileSchema>;
export type MyProfile = z.infer<typeof myProfileSchema>;
export type PlayerStats = z.infer<typeof profileStats>;
