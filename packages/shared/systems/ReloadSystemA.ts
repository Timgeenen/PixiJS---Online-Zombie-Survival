import type { Game } from '../core';
import type { ComponentData, Entity } from '../schemas';
import System from './System';

export default class ReloadSystemA<G extends Game> extends System {
    constructor(protected game: G) {
        super();
    }

    override update(dt: number): void {
        for (const e of this.game.isReloadingMap.keys()) {
            if (this.isReloading(e)) {
                return;
            }
            this.reloadWeapon(e);
            this.game.removeComponent(e, 'IsReloading');
        }
    }

    isReloading(e: Entity): boolean {
        return this.game.reloadCooldownMap.has(e);
    }

    reloadWeapon(e: Entity): void {
        const ammo = this.game.ammoMap.get(e);
        if (!ammo) {
            return;
        }
        const { current, total, max, clipSize } = ammo;
        const updatedAmmo: ComponentData<'Ammo'> = {
            current: clipSize,
            total: total - (clipSize - current),
            max,
            clipSize,
        };
        this.game.updateComponent(e, 'Ammo', updatedAmmo);
    }
}
