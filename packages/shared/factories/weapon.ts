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
    game.forgeTemplate(e, template);
    return e;
}
