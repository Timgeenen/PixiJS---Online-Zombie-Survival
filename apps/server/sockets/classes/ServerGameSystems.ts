import { GameSystems } from '@monorepo/shared/systems';
import type { ServerGame } from './ServerGame';

export class ServerGameSystems extends GameSystems<ServerGame> {
    constructor(game: ServerGame) {
        super(game);
    }
}
