import { NavButton } from '@Components';
import type { Lobby } from '@monorepo/shared';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import useSocketStore from 'src/store/useSocketStore';
import PlayerBanner from './PlayerBanner';

function LobbyContainer() {
    const { lobbyId } = useParams();
    const { socket, currentLobby, setLobby, joinLobby, leaveLobby } = useSocketStore(
        (state) => state,
    );
    let initialLobbyData = useLocation().state as Lobby | null;

    useEffect(() => {
        if (!socket?.connected || !lobbyId) return;
        if (initialLobbyData) {
            setLobby(initialLobbyData);
            initialLobbyData = null;
        }
        joinLobby(lobbyId);
        return () => {
            leaveLobby(lobbyId);
        };
    }, [socket?.connected, lobbyId]);

    if (!currentLobby) {
        return <h1 className="text-9xl">Loading...</h1>;
    }

    const Players = currentLobby.players.map((player) => (
        <PlayerBanner _id={player._id} username={player.username} level={player.stats.level} />
    ));

    return (
        <div className="flex flex-col gap-2">
            <ul>{...Players}</ul>
            <NavButton path="/game">Start Game</NavButton>
            <NavButton path="/lobbylist">Leave Lobby</NavButton>
        </div>
    );
}

export default LobbyContainer;
