import Game from '@Pages/Game';
import Leaderboards from '@Pages/Leaderboards';
import Lobby from '@Pages/Lobby';
import LobbyList from '@Pages/LobbyList';
import LobbySettings from '@Pages/LobbySettings';
import Login from '@Pages/Login';
import MainMenu from '@Pages/MainMenu';
import MyProfile from '@Pages/MyProfile';
import Settings from '@Pages/Settings';
import { Route, Routes } from 'react-router';

function AppRouter() {
    return (
        <Routes>
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/lobbylist" element={<LobbyList />} />
            <Route path="/lobbysettings" element={<LobbySettings />} />
            <Route path="/main" element={<MainMenu />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
}

export default AppRouter;
