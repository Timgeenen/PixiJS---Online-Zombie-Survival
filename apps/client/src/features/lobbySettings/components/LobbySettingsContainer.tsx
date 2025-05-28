import { Button, NavButton } from '@Components';
import {
    GAME_MODES,
    MAX_PLAYER_LIMIT,
    type GameDifficulty,
    type GameModes,
    type GameSettings,
} from '@monorepo/shared';
import { GAME_DIFFICULTIES } from '@monorepo/shared/constants';
import { useState } from 'react';
import SettingFields from './SettingFields';
import { createNewLobby } from '../services/lobbyServices';

const maxLobbyNameLength = 80;
const minLobbyNameLength = 1;
const maxPasswordLength = 20;
const minPasswordLength = 4;

function LobbySettingsContainer() {
    const [difficultyIndex, setDifficultyIndex] = useState<number>(0);
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        GAME_DIFFICULTIES[difficultyIndex]!,
    );
    const [gameMode, setGameMode] = useState<GameModes>(GAME_MODES[0]!);
    const [lobbyName, setLobbyName] = useState<string>('Join My Lobby');
    const [maxPlayers, setMaxPlayers] = useState<number>(4);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!GAME_MODES.includes(gameMode)) {
            return alert('Invalid game mode');
        }
        if (!GAME_DIFFICULTIES.includes(difficulty)) {
            return alert('Invalid difficulty setting');
        }
        if (gameMode === 'solo') {
            const settings: GameSettings = {
                gameMode,
                difficulty,
            };
            return createNewLobby(settings);
        }

        if (gameMode === 'multiplayer') {
            if (lobbyName.length > maxLobbyNameLength || lobbyName.length < minLobbyNameLength) {
                return alert(
                    `Lobby name has to be between ${minLobbyNameLength} and ${maxLobbyNameLength} characters long`,
                );
            }
            if (maxPlayers > MAX_PLAYER_LIMIT || maxPlayers < 2) {
                return alert(`Max players has to be between 2 and ${MAX_PLAYER_LIMIT}`);
            }

            const settings: GameSettings = {
                gameMode,
                difficulty,
                lobbyName,
                maxPlayers,
                isPrivate,
            };

            if (isPrivate) {
                if (password.length > maxPasswordLength || password.length < minPasswordLength) {
                    return alert(
                        `Password has to be between ${minPasswordLength} and ${maxPasswordLength} characters long`,
                    );
                }
                settings.password = password;
            }
            return createNewLobby(settings);
        }
    }

    function changeDifficulty(e: React.MouseEvent<HTMLButtonElement>, type: 'up' | 'down') {
        e.preventDefault();
        if (type === 'up') {
            const nextIndex = difficultyIndex + 1;
            if (nextIndex >= GAME_DIFFICULTIES.length) {
                return;
            }
            setDifficulty(GAME_DIFFICULTIES[nextIndex]!);
            setDifficultyIndex(nextIndex);
        }
        if (type === 'down') {
            const prevIndex = difficultyIndex - 1;
            if (prevIndex < 0) {
                return;
            }
            setDifficulty(GAME_DIFFICULTIES[prevIndex]!);
            setDifficultyIndex(prevIndex);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <SettingFields
                    difficulty={difficulty}
                    difficultyUp={(e) => changeDifficulty(e, 'up')}
                    difficultyDown={(e) => changeDifficulty(e, 'down')}
                    gameMode={gameMode}
                    setGameMode={setGameMode}
                    lobbyName={lobbyName}
                    setLobbyName={setLobbyName}
                    maxPlayers={maxPlayers}
                    setMaxPlayers={setMaxPlayers}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                    password={password}
                    setPassword={setPassword}
                />
                <Button onClick={handleSubmit}>Create Game</Button>
                <NavButton path="/main">Return To Menu</NavButton>
            </form>
        </div>
    );
}

export default LobbySettingsContainer;
