import type { Game } from '../core';
import type { AmmoType, Entity, EntityTemplate, Position, Radian } from '../schemas';
import { bulletBaseTemplate, bulletTemplates } from '../templates/bulletTemplates';
import { getVelocity } from '../utils';

export type CreateBulletData = { type: AmmoType; owner: Entity; position: Position, aim: Radian };

export default function createBullet<G extends Game>(
    game: G,
    data: CreateBulletData,
    extra?: EntityTemplate,
): Entity {
    const e = game.createEntity();
    const bulletTemplate = bulletTemplates[data.type]
    const template: EntityTemplate = {
        Owner: { entity: data.owner },
        Position: data.position,
        Velocity: getVelocity(data.aim),
        ...bulletBaseTemplate,
        ...bulletTemplate,
        ...extra,
    };
    game.forgeTemplate(e, template);
    return e;
}
