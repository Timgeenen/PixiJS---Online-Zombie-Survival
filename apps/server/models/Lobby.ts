import {
    GAME_DIFFICULTIES,
    GAME_MODES,
    type LobbySettings,
    type PublicProfile,
} from '@monorepo/shared';
import type { DBLobbyInput } from '@Types/db';
import mongoose from 'mongoose';
import { UserStatsSchema } from './User';

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

const ConnectedPlayersSchema = new mongoose.Schema<PublicProfile>({
    _id: {
        type: String,
        required: true,
        ref: 'User',
    },
    username: {
        type: String,
        required: true,
        ref: 'User',
    },
    stats: {
        type: UserStatsSchema,
        default: () => ({}),
    },
});

const LobbySchema = new mongoose.Schema<DBLobbyInput>({
    leader: {
        type: String,
        required: true,
    },
    inGame: {
        type: Boolean,
        required: true,
        default: false,
    },
    blackList: [
        {
            type: String,
            required: false,
            default: [],
            ref: 'User',
        },
    ],
    settings: {
        type: LobbySettingsSchema,
        default: () => ({}),
    },
    players: [ConnectedPlayersSchema],
});

LobbySchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const Lobby = mongoose.model('lobby', LobbySchema);

export default Lobby;
