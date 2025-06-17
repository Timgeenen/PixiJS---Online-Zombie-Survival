import Lobby from '@Models/Lobby';
import type { DBLobbyInput, DBLobby } from '@Types/db';
import { docToObject } from '@Utils/dbHelpers';

export async function createNewLobby(data: DBLobbyInput): Promise<DBLobby | null> {
    const lobbyDoc = await Lobby.create(data);
    return lobbyDoc ? docToObject(lobbyDoc) : null;
}

export async function findLobbyById(id: string): Promise<DBLobby | null> {
    const lobbyDoc = await Lobby.findById(id);
    return lobbyDoc ? docToObject(lobbyDoc) : null;
}

export async function removeLobbyById(lobbyId: string): Promise<DBLobby | null> {
    const lobbyDoc = await Lobby.findByIdAndDelete(lobbyId);
    return lobbyDoc ? docToObject(lobbyDoc) : null;
}
