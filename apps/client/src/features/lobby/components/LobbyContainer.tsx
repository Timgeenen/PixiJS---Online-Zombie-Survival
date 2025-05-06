import { NavButton } from '@Components';

function LobbyContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/game">Start Game</NavButton>
            <NavButton path="/lobbylist">Leave Lobby</NavButton>
        </div>
    );
}

export default LobbyContainer;
