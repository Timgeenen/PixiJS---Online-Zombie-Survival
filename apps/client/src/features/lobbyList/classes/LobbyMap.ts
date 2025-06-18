import type { LobbyListData } from '@monorepo/shared';

export class LobbyMap extends Map<string, LobbyListData> {
    constructor(entries?: readonly (readonly [string, LobbyListData])[] | null) {
        super(entries ?? []);
    }

    getLobby(lobby_id: string): LobbyListData | void {
        const lobby = this.get(lobby_id);
        if (!lobby) {
            return console.error('Could not find lobby in lobbyMap');
        }
        return lobby;
    }
}
