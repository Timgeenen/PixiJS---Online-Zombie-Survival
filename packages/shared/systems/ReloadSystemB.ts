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
            if (!input.reload) {
                return;
            }
            const weapon = this.game.currentWeaponMap.get(e)?.entity;
            if (!weapon) {
                return;
            }
            this.game.queues.needsReload.push({ weapon });
        }
    }

    processQueue(): void {
        const queue = this.game.queues.needsReload;
        while (queue.length > 0) {
            const { weapon } = queue.shift()!;
            const reloadSpeed = this.game.reloadSpeedMap.get(weapon);
            if (!reloadSpeed) {
                return;
            }
            const weaponCooldowns = this.game.weaponCooldownsMap.get(weapon);
            if (!weaponCooldowns) {
                return;
            }
            this.game.updateComponent(weapon, 'WeaponCooldowns', {
                ...weaponCooldowns,
                reload: this.game.currentTick + reloadSpeed.ticks,
            });
            this.game.createComponent(weapon, 'IsReloading', {});
        }
        this.game.queues.needsReload = [];
    }
}
