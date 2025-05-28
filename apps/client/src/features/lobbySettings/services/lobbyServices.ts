import { HTTPClient } from '@API';
import type { GameSettings } from '@monorepo/shared';

export async function createNewLobby(settings: GameSettings) {
    const promise = await HTTPClient.post('/api/lobby/create', settings);
    return promise;
}
