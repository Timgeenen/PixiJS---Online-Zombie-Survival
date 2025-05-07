import {
    Game,
    Leaderboards,
    Lobby,
    LobbyList,
    LobbySettings,
    Login,
    MainMenu,
    MyProfile,
    Settings,
} from '@Pages';
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
