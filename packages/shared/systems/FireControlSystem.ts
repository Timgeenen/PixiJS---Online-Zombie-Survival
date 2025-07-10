import type { Game } from '../core';
import type { ComponentData, Entity } from '../schemas';

export default class FireControlSystem<G extends Game> {
    constructor(protected game: G) {}

    update(dt: number): void {
        for (const [e, input] of this.game.inputStateMap) {
            if (!input.shoot || this.game.isReloadingMap.has(e)) {
                continue;
            }
            const weapon = this.getWeapon(e)?.entity;
            if (!weapon) {
                console.error('Could not spawn bullet: no weapon found for entity');
                continue;
            }
            const weaponCooldowns = this.getFireCooldown(weapon);
            if (!weaponCooldowns) {
                console.error('Could not spawn bullet: no weaponcooldowns found');
                continue;
            }
            if (!this.canShoot(weaponCooldowns)) {
                continue;
            }
            this.game.queues.fireReq.push({
                shooter: e,
                weapon: weapon,
                tick: input.tick,
            });
        }
    }

    canShoot(cooldowns: ComponentData<'WeaponCooldowns'>): boolean {
        return (
            cooldowns.fireRate <= this.game.currentTick && cooldowns.reload <= this.game.currentTick
        );
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
