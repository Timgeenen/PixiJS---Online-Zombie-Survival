import type { GameSettings } from '@monorepo/shared';
import type { Request, Response } from 'express';

export async function createNewLobby(req: Request, res: Response) {
    const gameSettings = req.body;

    if (gameSettings.gameMode === 'solo') {
        console.log(gameSettings.gameMode);
    }
    if (gameSettings.gameMode === 'multiplayer') {
        console.log(gameSettings.gameMode);
    }
}
