import type { EntityTemplate, WeaponType } from '../schemas';

export type WeaponBaseTemplateType = Pick<EntityTemplate, 'EntityType' | 'WeaponCooldowns'>;

export const WeaponBaseTemplate: WeaponBaseTemplateType = {
    EntityType: { name: 'weapon' },
    WeaponCooldowns: { reload: 0, fireRate: 0 },
};

export const WeaponTemplates: Record<WeaponType, EntityTemplate> = {
    pistol: {
        Ammo: { current: 20, max: 'inf', clipSize: 20, total: 'inf' },
        AmmoType: { name: 'pistol' },
        ReloadSpeed: { ticks: 120 },
        AttackType: { name: 'ranged' },
        FireRate: { ticks: 10 },
    },
    smg: {},
    assault_rifle: {},
    bazooka: {},
};
