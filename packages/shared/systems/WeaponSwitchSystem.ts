import type { Game } from '../core';
import System from './System';

export default class WeaponSwitchSystem<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        for (const [e, data] of this.game.switchWeaponMap) {
            const inventory = this.game.weaponInventoryMap.get(e);
            if (!inventory || inventory.entities.length <= 1) {
                return;
            }
            const currentWeapon = this.game.currentWeaponMap.get(e)!.entity;
            const currentIndex = inventory.entities.findIndex((weapon) => weapon === currentWeapon);
            if (!currentIndex) {
                this.game.updateComponent(e, 'CurrentWeapon', { entity: inventory.entities[0]! });
                return;
            }
            const newIndex = (inventory.entities.length % data.count) + currentIndex;
            if (newIndex === currentIndex) {
                return;
            }
            this.game.updateComponent(e, 'CurrentWeapon', {
                entity: inventory.entities[newIndex]!,
            });
        }
    }
}
