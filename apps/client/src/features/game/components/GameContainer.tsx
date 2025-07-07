import { NavButton } from '@Components';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import GameCanvas from './GameCanvas';

function GameContainer() {
    const { lobby_id } = useParams();

    useEffect(() => {}, []);
    return (
        <div className="flex flex-col gap-2">
            <GameCanvas />
            <NavButton path="/main">Leave Game</NavButton>
            <NavButton path={`/lobby/${lobby_id}`}>Return To Lobby</NavButton>
        </div>
    );
}

export default GameContainer;
