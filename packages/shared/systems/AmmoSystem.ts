import { Game } from '../core';
import System from './System';

export default class AmmoSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        const queue = this.game.queues.fireReq;

        while (queue.length > 0) {
            const { weapon, shooter, tick } = queue.shift()!;
            const ammo = this.game.ammoMap.get(weapon);
            if (!ammo) {
                return;
            }
            if (ammo.current === 0) {
                if (ammo.total === 0) {
                    this.game.queues.weaponDepleted.push({
                        owner: shooter,
                        weapon: weapon,
                    });
                    return;
                }
                this.game.queues.needsReload.push({ weapon });
                return;
            }
            const ammoRef = this.game.ammoTypeMap.get(weapon);
            if (!ammoRef) {
                return;
            }
            this.game.queues.spawn.push({
                entityType: 'bullet',
                templateRef: ammoRef.name,
                tick,
                owner: shooter,
            });
        }
        this.game.queues.fireReq = queue;
    }
}
