import { HTTPClient } from '@API';
import type { ApiResponse, Lobby, LobbySettings } from '@monorepo/shared';

export async function createNewLobby(settings: LobbySettings): Promise<ApiResponse<Lobby>> {
    return await HTTPClient.post('/api/lobby/create', settings);
}
