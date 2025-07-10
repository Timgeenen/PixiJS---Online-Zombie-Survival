import type { Game } from '../core';
import System from './System';

export default class MovementPredictSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        for (const [e, velocity] of this.game.velocityMap) {
            const { vx, vy } = velocity;
            if (vx === 0 && vy === 0) {
                continue;
            }
            let speed = this.game.speedMap.get(e);
            if (!speed) {
                speed = { px: 1 };
                console.warn(`[ClientMovementSystem] Could not find speed: entity ${e}`);
            }
            const position = this.game.positionMap.get(e);
            if (!position) {
                console.error(
                    `[ClientMovementSystem] could not update position: position not found: entity ${e}`,
                );
                continue;
            }
            const x = position.x + vx * speed.px;
            const y = position.y + vy * speed.px;
            this.game.createComponent(e, 'NextPosition', { x, y });
        }
    }
}
