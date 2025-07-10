import type { AmmoType, EntityTemplate } from '../schemas';

export type bulletBaseTemplate = Pick<EntityTemplate, 'Lifetime' | 'EntityType' | 'IsBullet'>;

export const bulletBaseTemplate: bulletBaseTemplate = {
    IsBullet: {},
    Lifetime: { ticks: 60 },
    EntityType: { name: 'bullet' },
};

export const bulletTemplates: Record<AmmoType, EntityTemplate> = {
    pistol: {
        Speed: { px: 40 },
        Hitbox: { width: 10, height: 4, offsetX: 5, offsetY: 2 },
        Lifetime: { ticks: 60 },
        Damage: { amount: 10 },
        AmmoType: { name: 'pistol' },
    },
};
