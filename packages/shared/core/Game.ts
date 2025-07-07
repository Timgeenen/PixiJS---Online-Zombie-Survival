import {
    ComponentSchemas,
    GameEventSchemas,
    type ComponentData,
    type ComponentType,
    type Entity,
    type EntityTemplate,
    type GameEvent,
    type GameEventType,
    type GameState,
    type InputState,
} from '../schemas';

type GameEventQueues = { [K in GameEventType]: GameEvent<K>[] };

export abstract class Game {
    [key: string]: any;
    currentTick: number;
    playerMap!: Map<Entity, ComponentData<'Player'>>;
    // playerEntityMap!: Map<string, Entity>;
    inputStateMap!: Map<Entity, InputState>;
    queues: GameEventQueues;

    nextPositionMap!: Map<Entity, ComponentData<'NextPosition'>>;
    speedMap!: Map<Entity, ComponentData<'Speed'>>;
    ammoMap!: Map<Entity, ComponentData<'Ammo'>>;
    attackRangeMap!: Map<Entity, ComponentData<'AttackRange'>>;
    // cooldownMap!: Map<Entity, ComponentData<'Cooldown'>>;
    damageMap!: Map<Entity, ComponentData<'Damage'>>;
    // durationMap!: Map<Entity, ComponentData<'Duration'>>;
    fireRateMap!: Map<Entity, ComponentData<'FireRate'>>;
    hitboxMap!: Map<Entity, ComponentData<'Hitbox'>>;
    hpMap!: Map<Entity, ComponentData<'HP'>>;
    lifetimeMap!: Map<Entity, ComponentData<'Lifetime'>>;
    maxTravelDistanceMap!: Map<Entity, ComponentData<'MaxTravelDistance'>>;
    positionMap!: Map<Entity, ComponentData<'Position'>>;
    reloadSpeedMap!: Map<Entity, ComponentData<'ReloadSpeed'>>;
    rotationMap!: Map<Entity, ComponentData<'Rotation'>>;
    velocityMap!: Map<Entity, ComponentData<'Velocity'>>;
    weaponRangeMap!: Map<Entity, ComponentData<'WeaponRange'>>;
    currentWeaponMap!: Map<Entity, ComponentData<'CurrentWeapon'>>;
    ownerMap!: Map<Entity, ComponentData<'Owner'>>;
    targetMap!: Map<Entity, ComponentData<'Target'>>;
    aiMap!: Map<Entity, ComponentData<'AI'>>;
    entityTypeMap!: Map<Entity, ComponentData<'EntityType'>>;
    enemyTypeMap!: Map<Entity, ComponentData<'EnemyType'>>;
    attackTypeMap!: Map<Entity, ComponentData<'AttackType'>>;
    ammoTypeMap!: Map<Entity, ComponentData<'AmmoType'>>;
    itemTypeMap!: Map<Entity, ComponentData<'ItemType'>>;
    createdAtMap!: Map<Entity, ComponentData<'CreatedAt'>>;
    lastUpdatedAtMap!: Map<Entity, ComponentData<'LastUpdatedAt'>>;
    isBulletMap!: Map<Entity, ComponentData<'IsBullet'>>;
    isItemMap!: Map<Entity, ComponentData<'IsItem'>>;
    isEnemyMap!: Map<Entity, ComponentData<'IsEnemy'>>;
    isPickupMap!: Map<Entity, ComponentData<'IsPickup'>>;
    isReloadingMap!: Map<Entity, ComponentData<'IsReloading'>>;
    weaponInventoryMap!: Map<Entity, ComponentData<'WeaponInventory'>>;

    //cooldown maps
    combatCooldownsMap!: Map<Entity, ComponentData<'CombatCooldowns'>>;
    weaponCooldownsMap!: Map<Entity, ComponentData<'WeaponCooldowns'>>;
    // skillCooldownMap!: Map<Entity, ComponentData<'SkillCooldown'>>;

    //event maps
    switchWeaponMap!: Map<Entity, ComponentData<'SwitchWeapon'>>;

    constructor(data: GameState) {
        for (const key of Object.keys(ComponentSchemas) as ComponentType[]) {
            const mapName = this.getMapName(key);
            this[mapName] = new Map(data[key] ? Object.entries(data[key]).map(([k, v]) => [Number(k), v]) : []);
        }
        this.currentTick = 0;

        this.queues = {
            shoot: [],
            pickup: [],
            hit: [],
            spawn: [],
            justSpawned: [],
            death: [],
            fireReq: [],
            weaponDepleted: [],
            needsReload: [],
        };
    }

    forgeTemplate(e: Entity, template: EntityTemplate) {
        for (const [comp, val] of Object.entries(template)) {
            const typedComp = comp as ComponentType;
            this.createComponent(e, typedComp, val);
        }
        this.queues.justSpawned.push({ entity: e });
    }

    createComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootCreateComponent(e, component, value);
    }

    _rootCreateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        const mapName = this.getMapName(component);
        (this[mapName] as Map<Entity, typeof value>).set(e, value);
    }

    updateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootUpdateComponent(e, component, value);
    }

    _rootUpdateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        const mapName = this.getMapName(component);
        (this[mapName] as Map<Entity, typeof value>).set(e, value);
    }

    removeComponent<K extends ComponentType>(e: Entity, component: K): void {
        this._rootRemoveComponent(e, component);
    }

    _rootRemoveComponent<K extends ComponentType>(e: Entity, component: K): void {
        const mapName = this.getMapName(component);
        (this[mapName] as Map<Entity, typeof component>).delete(e);
    }

    createEntity(): Entity {
        return 0;
    }
    
    protected _rootDespawn(e: Entity) {
        for (const key of Object.keys(ComponentSchemas) as ComponentType[]) {
            this.removeComponent(e, key);
        }
    }

    protected getMapName<K extends ComponentType>(name: K): string {
        return name.charAt(0).toLowerCase() + name.slice(1) + 'Map';
    }

    getMap<K extends ComponentType>(name: K): Map<Entity, ComponentData<K>> {
        const mapName = this.getMapName(name);
        return this[mapName];
    }
}
