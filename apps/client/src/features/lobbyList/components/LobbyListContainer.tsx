import { NavButton } from '@Components';

function LobbyListContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/main">Return To Menu</NavButton>
            <NavButton path="/lobby">Join Lobby</NavButton>
        </div>
    );
}

export default LobbyListContainer;
