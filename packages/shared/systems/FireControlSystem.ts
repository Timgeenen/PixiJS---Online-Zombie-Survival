import type { Game } from '../core';
import type { ComponentData, Entity } from '../schemas';

export default class FireControlSystem<G extends Game> {
    constructor(protected game: G) {}

    update(dt: number) {
        for (const [e, input] of this.game.inputStateMap) {
            if (!input.shoot || input.reload) {
                return;
            }
            const weapon = this.getWeapon(e)?.entity;
            if (!weapon || this.isReloading(weapon)) {
                return;
            }
            const weaponCooldowns = this.getFireCooldown(weapon);
            const fireRate = this.getFireRate(weapon)?.ticks;
            if (!weaponCooldowns || !fireRate) {
                return;
            }
            this.game.updateComponent(weapon, 'WeaponCooldowns', {
                ...weaponCooldowns,
                reload: this.game.currentTick + fireRate,
            });
            this.game.queues.fireReq.push({
                shooter: e,
                weapon: weapon,
                tick: input.tick,
            });
        }
    }

    isReloading(e: Entity): boolean {
        return this.game.reloadCooldownMap.has(e);
    }
    getFireCooldown(e: Entity): ComponentData<'WeaponCooldowns'> | undefined {
        return this.game.weaponCooldownsMap.get(e);
    }
    getFireRate(e: Entity): ComponentData<'FireRate'> | undefined {
        return this.game.fireRateMap.get(e);
    }
    getWeapon(e: Entity): ComponentData<'CurrentWeapon'> | undefined {
        return this.game.currentWeaponMap.get(e);
    }
}
