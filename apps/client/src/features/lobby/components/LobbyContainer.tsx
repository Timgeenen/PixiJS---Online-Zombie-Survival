import { Button, NavButton } from '@Components';
import { useAuthStore } from '@Store';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import useLobbyStore from 'src/store/useLobbyStore';
import useSocketStore from 'src/store/useSocketStore';
import PlayerBanner from './PlayerBanner';

function LobbyContainer() {
    const { lobby_id } = useParams();
    const { socket } = useSocketStore((state) => state);
    const { currentLobby, joinLobby, leaveLobby, emitSetPlayerReady, emitStartLobby } =
        useLobbyStore((state) => state);
    const { user } = useAuthStore((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket?.connected || !lobby_id) return;
        joinLobby(lobby_id);
        return () => {
            //TODO: only remove if game is not being started
            // leaveLobby(lobby_id);
        };
    }, [socket?.connected, lobby_id]);

    useEffect(() => {
        if (!currentLobby?.inGame) {
            return;
        }
        navigate(`/game/${lobby_id}`);
    }, [currentLobby?.inGame]);

    if (!currentLobby) {
        return <h1 className="text-9xl">Loading...</h1>;
    }

    const Players = Array.from(currentLobby.players.values()).map((player) => (
        <PlayerBanner
            _id={player._id}
            username={player.username}
            level={player.stats.level}
            isReady={player.isReady}
            isLeader={player._id === currentLobby.leader}
        />
    ));

    return (
        <div className="flex flex-col gap-2">
            <ul>{...Players}</ul>
            {user?._id === currentLobby.leader ? (
                <Button onClick={emitStartLobby}>Start Game</Button>
            ) : (
                <Button onClick={emitSetPlayerReady}>Ready</Button>
            )}
            <NavButton path="/lobbylist">Leave Lobby</NavButton>
        </div>
    );
}

export default LobbyContainer;
