import { LabeledInput } from '@Components';
import {
    GAME_MODES,
    MAX_PLAYER_LIMIT,
    type GameDifficulty,
    type GameModes,
} from '@monorepo/shared';
import type { Dispatch, SetStateAction } from 'react';
import SingleValueToggle from 'src/components/ui/SingleValueToggle';
import TwoWaySwitch from 'src/components/ui/TwoWaySwitch';
import ValueSwitcher from 'src/components/ui/ValueSwitcher';

interface Props {
    difficulty: GameDifficulty;
    difficultyUp: (e: React.MouseEvent<HTMLButtonElement>) => void;
    difficultyDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    gameMode: GameModes;
    setGameMode: Dispatch<SetStateAction<GameModes>>;
    lobbyName: string;
    setLobbyName: Dispatch<SetStateAction<string>>;
    maxPlayers: number;
    setMaxPlayers: Dispatch<SetStateAction<number>>;
    isPrivate: boolean;
    setIsPrivate: Dispatch<SetStateAction<boolean>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
}

function SettingFields({
    difficulty,
    difficultyUp,
    difficultyDown,
    gameMode,
    setGameMode,
    lobbyName,
    setLobbyName,
    maxPlayers,
    setMaxPlayers,
    isPrivate,
    setIsPrivate,
    password,
    setPassword,
}: Props) {
    return (
        <>
            <ValueSwitcher
                currentValue={difficulty}
                prevButtonProps={{ onClick: difficultyDown }}
                nextButtonProps={{ onClick: difficultyUp }}
            />
            <TwoWaySwitch
                name="gameMode"
                currentValue={gameMode}
                leftInputProps={{
                    value: GAME_MODES[0]!,
                    onChange: (e) => {
                        setGameMode(e.target.value as GameModes);
                    },
                }}
                RightInputProps={{
                    value: GAME_MODES[1]!,
                    onChange: (e) => {
                        setGameMode(e.target.value as GameModes);
                    },
                }}
            />
            {gameMode === 'multiplayer' && (
                <>
                    <LabeledInput
                        htmlFor="Lobby Description"
                        onChange={(e) => {
                            e.preventDefault();
                            setLobbyName(e.target.value);
                        }}
                        value={lobbyName}
                        minLength={1}
                        maxLength={80}
                    />
                    <ValueSwitcher
                        currentValue={maxPlayers}
                        prevButtonProps={{
                            onClick: (e) => {
                                e.preventDefault();
                                if (maxPlayers <= 2) {
                                    return setMaxPlayers(2);
                                }
                                return setMaxPlayers((prev) => prev - 1);
                            },
                        }}
                        nextButtonProps={{
                            onClick: (e) => {
                                e.preventDefault();
                                if (maxPlayers >= MAX_PLAYER_LIMIT) {
                                    return setMaxPlayers(MAX_PLAYER_LIMIT);
                                }
                                return setMaxPlayers((prev) => prev + 1);
                            },
                        }}
                    />
                    <SingleValueToggle
                        htmlFor="Private"
                        isSelected={isPrivate}
                        onChange={() => setIsPrivate((prev) => !prev)}
                    />
                    {isPrivate && (
                        <LabeledInput
                            htmlFor="Password"
                            value={password}
                            type="password"
                            minLength={4}
                            maxLength={20}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default SettingFields;
