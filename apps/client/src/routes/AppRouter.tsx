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
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboards" element={<Leaderboards />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/lobbylist" element={<LobbyList />} />
                <Route path="/lobbysettings" element={<LobbySettings />} />
                <Route path="/main" element={<MainMenu />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;
