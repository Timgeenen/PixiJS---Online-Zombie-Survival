import { GAME_DIFFICULTIES, GAME_MODES, type LobbySettings } from '@monorepo/shared';
import type { DBLobbyInput } from '@Types/db';
import mongoose from 'mongoose';

const LobbySettingsSchema = new mongoose.Schema<LobbySettings>(
    {
        gameMode: {
            type: String,
            required: true,
            enum: GAME_MODES,
        },
        difficulty: {
            type: String,
            required: true,
            enum: GAME_DIFFICULTIES,
        },
        lobbyName: {
            type: String,
            required: false,
        },
        maxPlayers: {
            type: Number,
            required: false,
        },
        isPrivate: {
            type: Boolean,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
    },
    { _id: false },
);

const LobbySchema = new mongoose.Schema<DBLobbyInput>({
    settings: {
        type: LobbySettingsSchema,
        default: () => ({}),
    },
});

LobbySchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.settings.password;
        return ret;
    },
});

const Lobby = mongoose.model('lobby', LobbySchema);

export default Lobby;
