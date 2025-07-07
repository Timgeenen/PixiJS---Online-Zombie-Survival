import type { GameSettings, Keybindings, PlayerSettings, PlayerStats } from '@monorepo/shared';
import type { DBUserInput } from '@Types/db';
import mongoose from 'mongoose';

export const UserStatsSchema = new mongoose.Schema<PlayerStats>(
    {
        level: {
            type: Number,
            required: true,
            default: 1,
        },
        experience: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { _id: false },
);

const GameSettingsSchema = new mongoose.Schema<GameSettings>(
    {
        shootOnAim: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { _id: false },
);

const KeybindingsSchema = new mongoose.Schema<Keybindings>(
    {
        up: {
            type: String,
            required: true,
            default: 'W',
        },
        down: {
            type: String,
            required: true,
            default: 'S',
        },
        left: {
            type: String,
            required: true,
            default: 'A',
        },
        right: {
            type: String,
            required: true,
            default: 'D',
        },
        aimUp: {
            type: String,
            required: true,
            default: 'ARROWUP',
        },
        aimDown: {
            type: String,
            required: true,
            default: 'ARROWDOWN',
        },
        aimLeft: {
            type: String,
            required: true,
            default: 'ARROWLEFT',
        },
        aimRight: {
            type: String,
            required: true,
            default: 'ARROWRIGHT',
        },
        shoot: {
            type: String,
            required: true,
            default: ' ',
        },
        reload: {
            type: String,
            required: true,
            default: 'R',
        },
        nextWeapon: {
            type: String,
            required: true,
            default: 'E',
        },
        prevWeapon: {
            type: String,
            required: true,
            defaul: 'Q',
        },
    },
    { _id: false },
);

const UserSettingsSchema = new mongoose.Schema<PlayerSettings>(
    {
        gameSettings: {
            type: GameSettingsSchema,
            default: () => ({}),
        },
        keybindings: {
            type: KeybindingsSchema,
            default: () => ({}),
        },
    },
    { _id: false },
);

const UserSchema = new mongoose.Schema<DBUserInput>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    stats: {
        type: UserStatsSchema,
        default: () => ({}),
    },
    settings: {
        type: UserSettingsSchema,
        default: () => ({}),
    },
});

UserSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.password;
        return ret;
    },
});

UserSchema.set('toObject', {
    transform: (_, ret) => {
        ret._id = ret._id.toString();
        return ret;
    },
});

let User = mongoose.model('user', UserSchema);

export default User;
