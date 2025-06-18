import { Button, NavButton } from '@Components';
import { useAuthStore } from '@Store';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import useSocketStore from 'src/store/useSocketStore';
import PlayerBanner from './PlayerBanner';
import useLobbyStore from 'src/store/useLobbyStore';

function LobbyContainer() {
    const { lobbyId } = useParams();
    const { socket } = useSocketStore((state) => state);
    const { currentLobby, joinLobby, leaveLobby, emitSetPlayerReady } = useLobbyStore(
        (state) => state,
    );
    const { user } = useAuthStore((state) => state);
    const hasJoinedRef = useRef(false);

    function handleStartGame() {
        console.log('STARTING GAME');
        // navigate(`/game/${lobbyId}`);
    }
    function handleSetReady() {
        if (!user) {
            return console.error('Could not set player ready: player not found');
        }
        emitSetPlayerReady(user._id);
        if (!lobbyId) {
            return console.error('could not find lobbyId');
        }
    }

    useEffect(() => {
        if (!socket?.connected || !lobbyId || hasJoinedRef.current) return;
        joinLobby(lobbyId);
        hasJoinedRef.current = true;
        return () => {
            if (hasJoinedRef.current) {
                leaveLobby(lobbyId);
                hasJoinedRef.current = false;
            }
        };
    }, [socket?.connected, lobbyId]);

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
                <Button onClick={handleStartGame}>Start Game</Button>
            ) : (
                <Button onClick={handleSetReady}>Ready</Button>
            )}
            <NavButton path="/lobbylist">Leave Lobby</NavButton>
        </div>
    );
}

export default LobbyContainer;
