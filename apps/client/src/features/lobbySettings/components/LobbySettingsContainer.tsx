import { NavButton } from '@Components';

function LobbySettingsContainer() {
    return (
        <div>
            <NavButton path="/lobby">Create Lobby</NavButton>
            <NavButton path="/main">Return To Menu</NavButton>
        </div>
    );
}

export default LobbySettingsContainer;
