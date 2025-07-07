import { Game } from '../core';
import System from './System';

export default class AmmoSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        const queue = this.game.queues.fireReq.splice(0);

        while (queue.length > 0) {
            const { weapon, shooter, tick } = queue.shift()!;
            const ammo = this.game.ammoMap.get(weapon);
            const cooldowns = this.game.weaponCooldownsMap.get(weapon);
            if (!ammo) {
                console.error('Could not find ammo for weapon');
                continue; 
            }
            if (ammo.current === 0) {
                if (ammo.total === 0) {
                    this.game.queues.weaponDepleted.push({
                        owner: shooter,
                        weapon: weapon,
                    });
                    continue;
                }
                this.game.queues.needsReload.push({ weapon });
                continue;
            }
            const ammoRef = this.game.ammoTypeMap.get(weapon);
            if (!ammoRef) {
                console.error('Could not find ammoref');
                continue
            }
            ammo.current--
            this.game.ammoMap.set(weapon, ammo);
            const fireRate = this.game.fireRateMap.get(weapon);
            if (cooldowns && fireRate) { this.game.weaponCooldownsMap.set(weapon, { ...cooldowns, fireRate: this.game.currentTick + fireRate.ticks }) }
            this.game.queues.spawn.push({
                entityType: 'bullet',
                templateRef: ammoRef.name,
                tick,
                owner: shooter,
            });
        }
    }
}
