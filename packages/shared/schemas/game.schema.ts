import { z } from 'zod';
import type { Game } from '../core';
import { lobbyProfileSchema } from './user.schema';

export enum BufferComponents {
    Ammo,
    HP,
    Position,
    Rotation,
    Velocity,
    IsReloading,
    CurrentWeapon,
    LastUpdatedAt,
    Target,
    InputState,
    WeaponInventory,
}
export enum NetComponents {
    Ammo,
    HP,
    Position,
    Rotation,
    Velocity,
    WeaponInventory,
    Count, //keep last for caculating total bytes
}
// export const BITS = Math.ceil(NetComponents.Count) / 32;
// export type Mask = { bits: Uint32Array}
export const gameDifficultiesSchema = z.enum(['easy', 'normal', 'hard']);
export const gameModesSchema = z.enum(['solo', 'multiplayer']);
export const radSchema = z
    .number()
    .min(0)
    .max(Math.PI * 2);
export const tickSchema = z.number().int().min(0).nonnegative();
export const inputSnapshotSchema = z.object({
    tick: tickSchema,
    mx: z.number().min(-1).max(1),
    my: z.number().min(-1).max(1),
    shoot: z.number().int().min(0).max(1),
    aim: radSchema,
    reload: z.number().int().min(0).max(1),
    changeWeapon: z.number().int(),
});
export const inputStateSchema = inputSnapshotSchema
    .pick({ mx: true, my: true, shoot: true, aim: true, reload: true })
    .extend({
        tick: tickSchema,
    });
export const EntitySchema = z.number();
export const GameEntitiesSchema = z.enum([
    'player',
    'enemy',
    'bullet',
    'weapon',
    'item',
    'pickup',
    'effect',
    'obstacle',
    'spawner',
]);
export const AiTypeSchema = z.enum(['chasePlayer', 'idle', 'attackPlayer']);
export const weaponCooldownsSchema = z.object({
    reload: tickSchema,
    fireRate: tickSchema,
});
export const combatCooldownsSchema = z.object({
    attack: tickSchema,
    shoot: tickSchema,
});
export const EnemyTypeSchema = z.enum(['zombie']); //TODO: add more
export const AttackTypeSchema = z.enum(['melee', 'ranged']); //TODO: add more
export const ammoTypeSchema = z.enum(['pistol']); //TODO: add more
export const ItemTypeSchema = z.enum(['potion']); //TODO: add more
export const ItemRefSchema = z.enum(['grenade', 'healt_potion']); //TODO: add more
export const WeaponRefSchema = z.enum(['pistol', 'smg', 'assault_rifle', 'bazooka']); //TODO: add more
export const positionSchema = z.object({ x: z.number().int(), y: z.number().int() });
export const playerTypeSchema = z.enum(['player']);
export const templateRefSchema = z.enum([
    ...ammoTypeSchema.options,
    ...playerTypeSchema.options,
] as const);
export const spawnBulletReq = z.object({
    entityType: z.literal('bullet'),
    templateRef: ammoTypeSchema,
    owner: EntitySchema,
    tick: tickSchema,
});
export const spawnPlayerReq = z.object({
    entityType: z.literal('player'),
    templateRef: playerTypeSchema,
    profile: lobbyProfileSchema,
    tick: tickSchema,
    position: positionSchema.optional(),
});
export const ComponentSchemas = {
    // PlayerEntity: z.object({ entity: EntitySchema }),
    InputSnapshots: z.array(inputSnapshotSchema),
    InputState: inputStateSchema,
    Player: lobbyProfileSchema,
    // TemplateRef: z.object({ name: z.string() }),
    NextPosition: positionSchema,

    //bitmaps
    Dirty: z.object({ bits: z.instanceof(Uint32Array) }),
    Present: z.object({ bits: z.instanceof(Uint32Array) }),

    Ammo: z.object({
        current: z.number().int().nonnegative(),
        total: z.number().int().nonnegative().or(z.literal('inf')),
        max: z.number().int().nonnegative().or(z.literal('inf')),
        clipSize: z.number().int().nonnegative(),
    }), //TODO: set dynamic minmax
    AttackRange: z.object({ px: z.number() }), //TODO: set minmax
    Damage: z.object({ amount: z.number() }), //TODO: set minmax
    FireRate: z.object({ ticks: tickSchema }),
    Hitbox: z.object({
        width: z.number(),
        height: z.number(),
        offsetX: z.number(),
        offsetY: z.number(),
    }),
    HP: z.object({ current: z.number(), max: z.number() }),
    Lifetime: z.object({ ticks: tickSchema }), //TODO: set minmax
    MaxTravelDistance: z.object({ distance: z.number() }),
    Position: positionSchema,
    ReloadSpeed: z.object({ ticks: tickSchema }),
    Rotation: z.object({
        rad: z
            .number()
            .max(2 * Math.PI)
            .min(0),
    }),
    Velocity: z.object({ vx: z.number(), vy: z.number() }),
    Speed: z.object({ px: z.number().nonnegative() }),
    WeaponRange: z.object({ distance: z.number() }),
    WeaponInventory: z.object({ entities: z.array(EntitySchema) }),

    CurrentWeapon: z.object({ entity: EntitySchema }),
    Owner: z.object({ entity: EntitySchema }),
    Target: z.object({ entity: EntitySchema }),

    AI: z.object({ type: AiTypeSchema }),

    //types
    EntityType: z.object({ name: GameEntitiesSchema }),
    EnemyType: z.object({ name: EnemyTypeSchema }),
    AttackType: z.object({ name: AttackTypeSchema }),
    AmmoType: z.object({ name: ammoTypeSchema }),
    ItemType: z.object({ name: ItemTypeSchema }),

    //timestamps
    WeaponCooldowns: weaponCooldownsSchema,
    CombatCooldowns: combatCooldownsSchema,
    CreatedAt: z.object({ tick: z.number() }),
    LastUpdatedAt: z.object({ timestamp: z.number() }),

    //flags
    IsBullet: z.object({}),
    IsItem: z.object({}),
    IsEnemy: z.object({}),
    IsPickup: z.object({}),
    IsReloading: z.object({}),

    //events
    SwitchWeapon: z.object({
        count: z.number().int(),
    }),
};

export const GameEventSchemas = {
    hit: z.object({
        attacker: EntitySchema,
        target: EntitySchema,
        dmg: z.number(),
    }),
    shoot: z.object({
        shooter: EntitySchema,
        weapon: EntitySchema,
        tick: tickSchema,
    }),
    spawn: z.discriminatedUnion('entityType', [spawnBulletReq, spawnPlayerReq]),
    justSpawned: z.object({
        entity: EntitySchema,
    }),
    death: z.object({
        target: EntitySchema,
        attacker: EntitySchema.optional(),
    }),
    pickup: z.object({ item: EntitySchema, player: EntitySchema }),
    fireReq: z.object({
        shooter: EntitySchema,
        weapon: EntitySchema,
        tick: tickSchema,
        seq: z.number().int().nonnegative().optional(),
    }),
    weaponDepleted: z.object({ owner: EntitySchema, weapon: EntitySchema }),
    needsReload: z.object({
        weapon: EntitySchema,
        index: z.number().int().optional(),
    }),
};
export const clientDataSchema = z.object({
    snapshots: z.array(inputSnapshotSchema),
});
export const serverTickDataSchema = z.object({
    tick: tickSchema,
    serverTimeMs: z.number().int().nonnegative(),
});

export type GameEntities = z.infer<typeof GameEntitiesSchema>;
export type Radian = z.infer<typeof radSchema>;
export type SpawnBulletReq = z.infer<typeof spawnBulletReq>;
export type SpawnPlayerReq = z.infer<typeof spawnPlayerReq>;
export type PlayerType = z.infer<typeof playerTypeSchema>;
export type WeaponType = z.infer<typeof WeaponRefSchema>;
export type Position = z.infer<typeof positionSchema>;
export type AmmoType = z.infer<typeof ammoTypeSchema>;
export type GameEventType = keyof typeof GameEventSchemas;
export type GameEvent<K extends GameEventType> = z.infer<(typeof GameEventSchemas)[K]>;
export type Entity = z.infer<typeof EntitySchema>;
export type ComponentType = keyof typeof ComponentSchemas;
export type ComponentData<K extends ComponentType> = z.infer<(typeof ComponentSchemas)[K]>;
export type ZodToType<T> = T extends z.ZodTypeAny ? z.infer<T> : never;
// export type GameState = Partial<Record<keyof typeof ComponentSchemas, Record<Entity, any>>>
export type GameState = Partial<{
    [K in ComponentType]: Record<Entity, ComponentData<K>>;
}>;
export type EntityTemplate = Partial<{
    [K in ComponentType]: ComponentData<K>;
}>;
export type GameSystem = (game: Game, delta: number) => void;
export type InputSnapshot = z.infer<typeof inputSnapshotSchema>;
export type InputState = z.infer<typeof inputStateSchema>;
export type ClientData = z.infer<typeof clientDataSchema>;
export type ServerTickData = z.infer<typeof serverTickDataSchema>;
export type Tick = z.infer<typeof tickSchema>;
// {
//   [K in keyof typeof ComponentSchemas]?: Record<Entity, ZodToType<(typeof ComponentSchemas)[K]>>
// };
