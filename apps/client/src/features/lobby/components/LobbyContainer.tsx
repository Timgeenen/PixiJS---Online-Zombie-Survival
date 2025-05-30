import { NavButton } from '@Components';
import type { Lobby } from '@monorepo/shared';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

function LobbyContainer() {
    const lobbyData = useLocation().state as Lobby;
    console.log(lobbyData);

    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/game">Start Game</NavButton>
            <NavButton path="/lobbylist">Leave Lobby</NavButton>
        </div>
    );
}

export default LobbyContainer;
