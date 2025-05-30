import Lobby from '@Models/Lobby';
import type { DBLobbyInput } from '@Types/db';

export async function createNewLobby(settings: DBLobbyInput) {
    return await Lobby.create(settings);
}
