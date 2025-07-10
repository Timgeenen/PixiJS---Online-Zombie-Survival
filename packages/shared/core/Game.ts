import { TICK } from '../constants';
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
    public readonly tickDt = TICK * 1000;
    public currentTick: number;
    public playerMap!: Map<Entity, ComponentData<'Player'>>;
    // playerEntityMap!: Map<string, Entity>;
    public inputStateMap!: Map<Entity, InputState>;
    public queues: GameEventQueues;

    public nextPositionMap!: Map<Entity, ComponentData<'NextPosition'>>;
    public speedMap!: Map<Entity, ComponentData<'Speed'>>;
    public ammoMap!: Map<Entity, ComponentData<'Ammo'>>;
    public attackRangeMap!: Map<Entity, ComponentData<'AttackRange'>>;
    // cooldownMap!: Map<Entity, ComponentData<'Cooldown'>>;
    // durationMap!: Map<Entity, ComponentData<'Duration'>>;
    public damageMap!: Map<Entity, ComponentData<'Damage'>>;
    public fireRateMap!: Map<Entity, ComponentData<'FireRate'>>;
    public hitboxMap!: Map<Entity, ComponentData<'Hitbox'>>;
    public hpMap!: Map<Entity, ComponentData<'HP'>>;
    public lifetimeMap!: Map<Entity, ComponentData<'Lifetime'>>;
    public maxTravelDistanceMap!: Map<Entity, ComponentData<'MaxTravelDistance'>>;
    public positionMap!: Map<Entity, ComponentData<'Position'>>;
    public reloadSpeedMap!: Map<Entity, ComponentData<'ReloadSpeed'>>;
    public rotationMap!: Map<Entity, ComponentData<'Rotation'>>;
    public velocityMap!: Map<Entity, ComponentData<'Velocity'>>;
    public weaponRangeMap!: Map<Entity, ComponentData<'WeaponRange'>>;
    public currentWeaponMap!: Map<Entity, ComponentData<'CurrentWeapon'>>;
    public ownerMap!: Map<Entity, ComponentData<'Owner'>>;
    public targetMap!: Map<Entity, ComponentData<'Target'>>;
    public aiMap!: Map<Entity, ComponentData<'AI'>>;
    public entityTypeMap!: Map<Entity, ComponentData<'EntityType'>>;
    public enemyTypeMap!: Map<Entity, ComponentData<'EnemyType'>>;
    public attackTypeMap!: Map<Entity, ComponentData<'AttackType'>>;
    public ammoTypeMap!: Map<Entity, ComponentData<'AmmoType'>>;
    public itemTypeMap!: Map<Entity, ComponentData<'ItemType'>>;
    public createdAtMap!: Map<Entity, ComponentData<'CreatedAt'>>;
    public lastUpdatedAtMap!: Map<Entity, ComponentData<'LastUpdatedAt'>>;
    public isBulletMap!: Map<Entity, ComponentData<'IsBullet'>>;
    public isItemMap!: Map<Entity, ComponentData<'IsItem'>>;
    public isEnemyMap!: Map<Entity, ComponentData<'IsEnemy'>>;
    public isPickupMap!: Map<Entity, ComponentData<'IsPickup'>>;
    public isReloadingMap!: Map<Entity, ComponentData<'IsReloading'>>;
    public weaponInventoryMap!: Map<Entity, ComponentData<'WeaponInventory'>>;

    //cooldown maps
    public combatCooldownsMap!: Map<Entity, ComponentData<'CombatCooldowns'>>;
    public weaponCooldownsMap!: Map<Entity, ComponentData<'WeaponCooldowns'>>;
    // skillCooldownMap!: Map<Entity, ComponentData<'SkillCooldown'>>;

    //event maps
    public switchWeaponMap!: Map<Entity, ComponentData<'SwitchWeapon'>>;

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

    getPlayerEntity(player_id: string): Entity {
        let entity: Entity | null = null;
        for (const [e, player] of this.playerMap) {
            if (player._id === player_id) {
                return entity = e;
            }
        }
        if (!entity) {
            throw new Error('Could not find player_id in entity map');
        }
        return entity
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
