import { TICK } from '../constants';
import {
    BufferComponents,
    ComponentSchemas,
    NetComponents,
    type ComponentData,
    type ComponentType,
    type Entity,
    type EntityTemplate,
    type GameEvent,
    type GameEventType,
    type GameState,
    type InputState,
    type Tick,
} from '../schemas';

type GameEventQueues = { [K in GameEventType]: GameEvent<K>[] };

export abstract class Game {
    [key: string]: any;
    public readonly tickDt = TICK * 1000;
    public readonly bufferSize = 12;
    public currentTick: number;
    public queues: GameEventQueues;

    //static maps
    public playerMap!: Map<Entity, ComponentData<'Player'>>;
    public speedMap!: Map<Entity, ComponentData<'Speed'>>;
    public attackRangeMap!: Map<Entity, ComponentData<'AttackRange'>>;
    public damageMap!: Map<Entity, ComponentData<'Damage'>>;
    public fireRateMap!: Map<Entity, ComponentData<'FireRate'>>;
    public hitboxMap!: Map<Entity, ComponentData<'Hitbox'>>;
    public lifetimeMap!: Map<Entity, ComponentData<'Lifetime'>>;
    public maxTravelDistanceMap!: Map<Entity, ComponentData<'MaxTravelDistance'>>;
    public reloadSpeedMap!: Map<Entity, ComponentData<'ReloadSpeed'>>;
    public weaponRangeMap!: Map<Entity, ComponentData<'WeaponRange'>>;
    public ownerMap!: Map<Entity, ComponentData<'Owner'>>;
    public entityTypeMap!: Map<Entity, ComponentData<'EntityType'>>;
    public enemyTypeMap!: Map<Entity, ComponentData<'EnemyType'>>;
    public attackTypeMap!: Map<Entity, ComponentData<'AttackType'>>;
    public ammoTypeMap!: Map<Entity, ComponentData<'AmmoType'>>;
    public itemTypeMap!: Map<Entity, ComponentData<'ItemType'>>;
    public createdAtMap!: Map<Entity, ComponentData<'CreatedAt'>>;
    public isBulletMap!: Map<Entity, ComponentData<'IsBullet'>>;
    public isItemMap!: Map<Entity, ComponentData<'IsItem'>>;
    public isEnemyMap!: Map<Entity, ComponentData<'IsEnemy'>>;
    public isPickupMap!: Map<Entity, ComponentData<'IsPickup'>>;
    public nextPositionMap!: Map<Entity, ComponentData<'NextPosition'>>;
    public isReloadingMap!: Map<Entity, ComponentData<'IsReloading'>>;
    public currentWeaponMap!: Map<Entity, ComponentData<'CurrentWeapon'>>;
    public lastUpdatedAtMap!: Map<Entity, ComponentData<'LastUpdatedAt'>>;
    public targetMap!: Map<Entity, ComponentData<'Target'>>;
    // public aiMap!: Map<Entity, ComponentData<'AI'>>;

    //network components
    public inputStateMap!: Map<Entity, InputState>;
    public weaponInventoryMap!: Map<Entity, ComponentData<'WeaponInventory'>>;
    public ammoMap!: Map<Entity, ComponentData<'Ammo'>>;
    public hpMap!: Map<Entity, ComponentData<'HP'>>;
    public positionMap!: Map<Entity, ComponentData<'Position'>>;
    public rotationMap!: Map<Entity, ComponentData<'Rotation'>>;
    public velocityMap!: Map<Entity, ComponentData<'Velocity'>>;

    //cooldown maps
    public combatCooldownsMap!: Map<Entity, ComponentData<'CombatCooldowns'>>;
    public weaponCooldownsMap!: Map<Entity, ComponentData<'WeaponCooldowns'>>;

    //event maps
    public switchWeaponMap!: Map<Entity, ComponentData<'SwitchWeapon'>>;

    //buffers
    public AmmoBufferMap!: Map<Entity, Array<ComponentData<'Ammo'> & { tick: Tick }>>;
    public HPBufferMap!: Map<Entity, Array<ComponentData<'HP'> & { tick: Tick }>>;
    public PositionBufferMap!: Map<Entity, Array<ComponentData<'Position'> & { tick: Tick }>>;
    public RotationBufferMap!: Map<Entity, Array<ComponentData<'Rotation'> & { tick: Tick }>>;
    public VelocityBufferMap!: Map<Entity, Array<ComponentData<'Velocity'> & { tick: Tick }>>;
    public IsReloadingBufferMap!: Map<Entity, Array<ComponentData<'IsReloading'> & { tick: Tick }>>;
    public CurrentWeaponBufferMap!: Map<
        Entity,
        Array<ComponentData<'CurrentWeapon'> & { tick: Tick }>
    >;
    public LastUpdatedAtBufferMap!: Map<
        Entity,
        Array<ComponentData<'LastUpdatedAt'> & { tick: Tick }>
    >;
    public TargetBufferMap!: Map<Entity, Array<ComponentData<'Target'> & { tick: Tick }>>;
    public InputStateBufferMap!: Map<Entity, Array<ComponentData<'InputState'>>>;
    public WeaponInventoryBufferMap!: Map<
        Entity,
        Array<ComponentData<'WeaponInventory'> & { tick: Tick }>
    >;

    constructor(data: GameState) {
        for (const key of Object.keys(ComponentSchemas) as ComponentType[]) {
            const mapName = this.getMapName(key);
            this[mapName] = new Map(
                data[key] ? Object.entries(data[key]).map(([k, v]) => [Number(k), v]) : [],
            );
            if (this.isBufferComponent(key)) {
                const bufferMapName = this.getBufferMapName(key);
                this[bufferMapName] = new Map(
                    data[key]
                        ? Object.entries(data[key]).map(([k, v]) => [
                              Number(k),
                              [{ ...v, tick: 0 }],
                          ])
                        : [],
                );
            }
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
                return (entity = e);
            }
        }
        if (!entity) {
            throw new Error('Could not find player_id in entity map');
        }
        return entity;
    }

    public forgeTemplate(e: Entity, template: EntityTemplate) {
        for (const [comp, val] of Object.entries(template)) {
            const typedComp = comp as ComponentType;
            this.createComponent(e, typedComp, val);
        }
        this.queues.justSpawned.push({ entity: e });
    }

    public createComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootCreateComponent(e, component, value, this.currentTick);
    }

    public updateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootUpdateComponent(e, component, value, this.currentTick);
    }

    public removeComponent<K extends ComponentType>(e: Entity, component: K): void {
        this._rootRemoveComponent(e, component);
    }

    protected _rootRemoveComponent<K extends ComponentType>(e: Entity, component: K): void {
        const map = this.getMap(component);
        map.delete(e);
    }

    protected _rootCreateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
        tick: Tick,
    ): void {
        const map = this.getMap(component);
        map.set(e, value);
        if (this.isBufferComponent(component)) {
            this.addBufferTick(e, component, value, tick);
        }
    }

    protected _rootUpdateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
        tick: Tick,
    ): void {
        const map = this.getMap(component);
        map.set(e, value);
        if (this.isBufferComponent(component)) {
            this.addBufferTick(e, component, value, tick);
        }
    }

    public isNetComponent(component: string): boolean {
        return NetComponents[component as keyof typeof NetComponents] !== undefined;
    }

    public isBufferComponent(component: string): boolean {
        return BufferComponents[component as keyof typeof BufferComponents] !== undefined;
    }

    public addBufferTick<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
        tick: Tick,
    ): void {
        const bufferMap = this.getBufferMap(component);
        const data = { ...value, tick };
        const buffer = bufferMap.get(e) ?? [];
        buffer.push(data);
        const filtered = this.filterBuffer(buffer, component, tick);
        bufferMap.set(e, filtered);
    }

    public filterBuffer<K extends ComponentType>(
        buffer: Array<ComponentData<K> & { tick: Tick }>,
        component: K,
        latestTick: Tick,
    ): Array<ComponentData<K> & { tick: Tick }> {
        const expireTick = latestTick - this.bufferSize;
        const clean = buffer.filter((data) => data.tick >= expireTick);
        if (buffer.length > this.bufferSize) {
            clean.shift();
        }
        return clean;
    }

    public createEntity(): Entity {
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

    protected getBufferMapName<K extends ComponentType>(name: K): string {
        return name.charAt(0).toLocaleLowerCase() + name.slice(1) + 'BufferMap';
    }

    public getMap<K extends ComponentType>(name: K): Map<Entity, ComponentData<K>> {
        const mapName = this.getMapName(name);
        return this[mapName];
    }

    public getBufferMap<K extends ComponentType>(
        name: K,
    ): Map<Entity, Array<ComponentData<K> & { tick: Tick }>> {
        const mapName = this.getBufferMapName(name);
        return this[mapName];
    }
}
