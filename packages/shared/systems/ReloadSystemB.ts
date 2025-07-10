import type { Game } from '../core';
import System from './System';

export default class ReloadSystemB<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        this.setInputReloadEvents();
        this.processQueue();
    }

    setInputReloadEvents(): void {
        for (const [e, input] of this.game.inputStateMap) {
            if (input.reload === 0) {
                continue;
            }
            const weapon = this.game.currentWeaponMap.get(e)?.entity;
            if (!weapon) {
                console.error('Could not add reload event to queue: weapon not found');
                continue;
            }
            this.game.queues.needsReload.push({ weapon });
        }
    }

    processQueue(): void {
        const queue = this.game.queues.needsReload.splice(0);
        while (queue.length > 0) {
            const { weapon } = queue.shift()!;
            const reloadSpeed = this.game.reloadSpeedMap.get(weapon);
            if (!reloadSpeed) {
                console.error('Could not reload weapon: reloadspeed not found');
                continue;
            }
            const weaponCooldowns = this.game.weaponCooldownsMap.get(weapon);
            if (!weaponCooldowns) {
                continue;
            }
            this.game.updateComponent(weapon, 'WeaponCooldowns', {
                ...weaponCooldowns,
                reload: this.game.currentTick + reloadSpeed.ticks,
            });
            this.game.createComponent(weapon, 'IsReloading', {});
        }
    }
}
