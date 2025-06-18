import { NavButton } from '@Components';
import useLogoutMutation from '../hooks/useLogoutMutation';

function MainMenuContainer() {
    const logoutUserMutation = useLogoutMutation();
    function logout() {
        logoutUserMutation.mutate();
    }
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/lobbysettings">Create Game</NavButton>
            <NavButton path="/lobbylist">Find Lobby</NavButton>
            <NavButton path="/myprofile">Profile</NavButton>
            <NavButton path="/leaderboards">Leaderboards</NavButton>
            <NavButton path="/settings">Settings</NavButton>
            <NavButton onClick={logout} path="/">
                Logout
            </NavButton>
        </div>
    );
}

export default MainMenuContainer;
