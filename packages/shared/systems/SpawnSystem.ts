import type { Game } from '../core';
import createBullet from '../factories/bullet';
import { createPlayer } from '../factories/player';
import createWeapon from '../factories/weapon';
import type { Entity, SpawnBulletReq, SpawnPlayerReq } from '../schemas';
import { addWeaponToInv } from '../utils/inventory';
import System from './System';

export default class SpawnSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        const queue = this.game.queues.spawn.splice(0);
        for (const req of queue) {
            switch (req.entityType) {
                case 'bullet':
                    this.handleCreateBullet(req);
                    break;
                case 'player':
                    this.handleCreatePlayer(req);
                    break;
            }
        }
    }

    handleCreateBullet(req: SpawnBulletReq): Entity | undefined {
        const position = this.game.positionMap.get(req.owner);
        const rotation = this.game.rotationMap.get(req.owner)
        if (!position || !rotation) {
            return;
        }
        const entity = createBullet(this.game, {
            type: req.templateRef,
            owner: req.owner,
            position: position,
            aim: rotation.rad
        });
        return entity
    }

    handleCreatePlayer(req: SpawnPlayerReq): void {
        const position = req.position ?? { x: 0, y: 0 };
        const player = createPlayer(this.game, { type: req.templateRef, position, profile: req.profile })
        const pistol = createWeapon(this.game, { type: 'pistol', owner: player });
        addWeaponToInv(this.game, pistol, player);
    }
}
