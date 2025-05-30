import { Button, NavButton } from '@Components';
import { GAME_MODES, type GameDifficulties, type GameModes } from '@monorepo/shared';
import { GAME_DIFFICULTIES } from '@monorepo/shared/constants';
import { lobbySettingsSchema } from '@monorepo/shared/schemas';
import { useState } from 'react';
import { createNewLobby } from '../services/lobbyServices';
import SettingFields from './SettingFields';
import useCreateLobbyMutation from '../hooks/useCreateLobbyMutation';

function LobbySettingsContainer() {
    const [difficultyIndex, setDifficultyIndex] = useState<number>(0);
    const [difficulty, setDifficulty] = useState<GameDifficulties>(
        GAME_DIFFICULTIES[difficultyIndex]!,
    );
    const [gameMode, setGameMode] = useState<GameModes>(GAME_MODES[0]!);
    const [lobbyName, setLobbyName] = useState<string>('Join My Lobby');
    const [maxPlayers, setMaxPlayers] = useState<number>(4);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const createLobbyMutation = useCreateLobbyMutation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const settings =
            gameMode === 'solo'
                ? {
                      gameMode,
                      difficulty,
                  }
                : {
                      gameMode,
                      difficulty,
                      lobbyName,
                      maxPlayers,
                      isPrivate,
                      password,
                  };

        createLobbyMutation.mutate(settings);
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
