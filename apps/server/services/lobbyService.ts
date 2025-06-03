import Lobby from '@Models/Lobby';
import type { PublicProfile } from '@monorepo/shared';
import type { DBLobbyInput, DBLobbyOutput } from '@Types/db';

export async function createNewLobby(settings: DBLobbyInput): Promise<DBLobbyOutput> {
    return await Lobby.create(settings);
}

export async function findLobbyById(id: string): Promise<DBLobbyOutput | null> {
    return await Lobby.findById(id);
}

export async function joinLobby(
    lobbyId: string,
    playerData: PublicProfile,
): Promise<DBLobbyOutput | null> {
    return await Lobby.findByIdAndUpdate(lobbyId, { $addToSet: { players: playerData } });
}
