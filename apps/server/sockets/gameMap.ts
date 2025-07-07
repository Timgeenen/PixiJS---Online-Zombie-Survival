import type { Game } from '@monorepo/shared';
import type { ServerGame } from './classes/ServerGame';

export class GameMap extends Map<string, ServerGame> {
    constructor() {
        super();
    }
}
