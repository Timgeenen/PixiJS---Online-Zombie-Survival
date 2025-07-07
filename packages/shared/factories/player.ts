import type { Game } from '../core';
import type { ComponentData, Entity, EntityTemplate } from '../schemas';
import { PlayerBaseTemplate, PlayerTemplates } from '../templates';

export type CreatePlayerData = {
    type: keyof typeof PlayerTemplates;
    profile: ComponentData<'Player'>;
    position: ComponentData<'Position'>;
};

export function createPlayer<G extends Game>(
    game: G,
    data: CreatePlayerData,
    extra?: EntityTemplate,
): Entity {
    const e = game.createEntity();
    const template: EntityTemplate = {
        Player: data.profile,
        Position: data.position,
        WeaponInventory: { entities: [] },
        ...PlayerBaseTemplate,
        ...PlayerTemplates[data.type],
        ...extra,
    };

    game.forgeTemplate(e, template);
    return e;
}
