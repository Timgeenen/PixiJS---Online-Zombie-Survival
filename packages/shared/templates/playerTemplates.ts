import type { EntityTemplate, PlayerType } from '../schemas';

export type PlayerBaseTemplateType = Pick<
    EntityTemplate,
    'EntityType' | 'Hitbox' | 'Speed' | 'Velocity'
>;

export const PlayerBaseTemplate: PlayerBaseTemplateType = {
    EntityType: {
        name: 'player',
    },
    Hitbox: {
        width: 32,
        height: 32,
        offsetX: -16,
        offsetY: -16,
    },
    Speed: { px: 1 },
    Velocity: { vx: 0, vy: 0 },
};

export const PlayerTemplates: Record<PlayerType, EntityTemplate> = {
    player: {
        HP: {
            current: 100,
            max: 100,
        },
        Rotation: {
            rad: Math.PI,
        },
    },
};
