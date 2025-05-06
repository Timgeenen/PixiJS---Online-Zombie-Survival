import { NavButton } from '@Components';

function MainMenuContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/lobbysettings">Create Game</NavButton>
            <NavButton path="/lobbylist">Find Lobby</NavButton>
            <NavButton path="/myprofile">Profile</NavButton>
            <NavButton path="/leaderboards">Leaderboards</NavButton>
            <NavButton path="/settings">Settings</NavButton>
            <NavButton path="/">Logout</NavButton>
        </div>
    );
}

export default MainMenuContainer;
