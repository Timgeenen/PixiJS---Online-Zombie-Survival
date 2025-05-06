import { LobbySettingsContainer } from '@Features/lobbySettings';

function LobbySettings() {
    return (
        <div className="flex flex-col gap-2">
            Lobby Settings
            <LobbySettingsContainer />
        </div>
    );
}

export default LobbySettings;
