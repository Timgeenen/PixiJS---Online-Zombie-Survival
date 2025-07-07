import type { EntityTemplate, WeaponType } from "../schemas";

export type WeaponBaseTemplateType = Pick<EntityTemplate, 'EntityType'>

export const WeaponBaseTemplate: WeaponBaseTemplateType = {
    EntityType: { name: 'weapon' }
}

export const WeaponTemplates: Record<WeaponType, EntityTemplate> = {
    pistol: {
        Ammo: { current: 20, max: Infinity, clipSize: 20, total: Infinity},
        ReloadSpeed: { ticks: 60 },
        AttackType: { name: 'ranged'},
        FireRate: { ticks: 30 }
    },
    smg: {},
    assault_rifle: {},
    bazooka: {}
}