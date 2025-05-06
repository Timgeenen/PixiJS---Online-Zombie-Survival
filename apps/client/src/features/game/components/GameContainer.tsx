import { NavButton } from '@Components';

function GameContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/main">Leave Game</NavButton>
            <NavButton path="/lobby">Return To Lobby</NavButton>
        </div>
    );
}

export default GameContainer;
