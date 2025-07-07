import type { Game } from '../core';
import System from './System';

export default class MovementCommitSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        for (const [e, pos] of this.game.nextPositionMap) {
            this.game.updateComponent(e, 'Position', pos);
        }
        this.game.nextPositionMap.clear();
    }
}
