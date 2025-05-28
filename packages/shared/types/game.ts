export type GameDifficulty = 'easy' | 'normal' | 'hard';

export type GameModes = 'solo' | 'multiplayer';

interface BaseGameSettings {
    gameMode: GameModes;
    difficulty: GameDifficulty;
}

interface SoloLobbySettings extends BaseGameSettings {
    gameMode: 'solo';
}

interface MultiLobbySettings extends BaseGameSettings {
    gameMode: 'multiplayer';
    lobbyName: string;
    maxPlayers: number;
    isPrivate: boolean;
    password?: string;
}

export type GameSettings = SoloLobbySettings | MultiLobbySettings;
