import { NavButton } from '@Components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useLobbyStore from 'src/store/useLobbyStore';
import useSocketStore from 'src/store/useSocketStore';

function LobbyListContainer() {
    const { socket } = useSocketStore((state) => state);
    const { leaveLobbyList, joinLobbyList, lobbyMap } = useLobbyStore((state) => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (lobbyMap || !socket?.connected) {
            return;
        }
        joinLobbyList();
        return () => {
            leaveLobbyList();
        };
    }, [socket?.connected]);

    if (!lobbyMap) {
        return <h1 className="text-9xl">Loading...</h1>;
    }

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;
        const { action, lobby_id, isprivate } = target.dataset;
        if (!action || !lobby_id) {
            return;
        }
        if (!!!isprivate) {
            console.log('HANDLE PRIVATE ROOM');
        }
        navigate(`/lobby/${lobby_id}`);
    }

    const lobbies = Array.from(lobbyMap.values()).map((lobby) => (
        <div key={lobby._id} className="flex items-center">
            <span className="w-32">{lobby.settings.lobbyName}</span>
            <span className="w-10">{lobby.settings.difficulty}</span>
            <span className="w-14">{lobby.inGame ? 'Started' : 'Open'}</span>
            <span className="w-8">
                {lobby.currentPlayers}/{lobby.settings.maxPlayers}
            </span>
            <span className="w-8">{lobby.settings.isPrivate && 'Private'}</span>
            <button
                data-action="join"
                data-lobby_id={lobby._id}
                data-isprivate={lobby.settings.isPrivate}
                className="border p-1"
            >
                Join
            </button>
        </div>
    ));

    return (
        <div onClick={handleClick} className="flex flex-col gap-2">
            {...lobbies}
            <NavButton path="/main">Return To Menu</NavButton>
        </div>
    );
}

export default LobbyListContainer;
