import type { Game } from '../core';
import type { Entity, EntityTemplate, WeaponType } from '../schemas';
import { WeaponBaseTemplate, WeaponTemplates } from '../templates';

export type CreateWeaponData = { type: WeaponType; owner: Entity; };

export default function createWeapon<G extends Game>(
    game: G,
    data: CreateWeaponData,
    extra?: EntityTemplate,
): Entity {
    const e = game.createEntity();
    const template: EntityTemplate = {
        Owner: { entity: data.owner },
        ...WeaponBaseTemplate,
        ...WeaponTemplates[data.type],
        ...extra,
    };
    const inventory = game.weaponInventoryMap.get(data.owner)!;
    if (inventory && inventory.entities.length === 0) {
        game.currentWeaponMap.set(data.owner, { entity: e })
    }
    inventory.entities.push(e);
    game.weaponInventoryMap.set(data.owner, inventory)
    game.forgeTemplate(e, template);
    return e;
}
