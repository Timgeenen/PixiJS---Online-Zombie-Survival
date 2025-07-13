import {
    BITS,
    ComponentSchemas,
    Game,
    NetComponents,
    TICK,
    type ComponentData,
    type ComponentType,
    type Entity,
    type GameState,
    type Mask,
    type ServerPacket,
    type ServerTickData,
} from '@monorepo/shared';
import { ServerGameSystems } from './ServerGameSystems';
import logger from '@Utils/logger';

export class ServerGame extends Game {
    private entityId = 0;
    public systems: ServerGameSystems;
    public dirtyMaskMap: Map<Entity, Mask>;
    public gameEnd: boolean = false;
    // public newEntities: Set<Entity>;

    constructor(data: GameState) {
        super(data);
        this.systems = new ServerGameSystems(this);
        this.dirtyMaskMap = new Map();
        // this.newEntities = new Set();
    }

    public startGameLoop(sendClientUpdate: (packet: ServerPacket) => void): ServerTickData {
        const data = this.getServerTickData();
        let previous = performance.now();
        setInterval(() => {
            this.update(this.tickDt);
            if (this.currentTick % 3 === 0) {
                const packet = this.createPacket();
                if (!packet) {
                    return;
                }
                sendClientUpdate(packet);
            }
        }, this.tickDt);
        return data; //TODO: change interval to performance loop
    }

    public getServerTickData(): ServerTickData {
        return {
            serverTimeMs: Date.now(),
            tick: this.currentTick,
        };
    }

    public update(dt: number): void {
        this.currentTick++;
        this.systems.inputSystem.update(dt);
        this.systems.weaponSwitchSystem.update(dt);
        this.systems.reloadSystemA.update(dt);
        this.systems.fireControlSystem.update(dt);
        this.systems.ammoSystem.update(dt);
        this.systems.reloadSystemB.update(dt);
        this.systems.movementPredictSystem.update(dt);
        this.systems.movementCommitSystem.update(dt);
        this.systems.spawnSystem.update(dt);
    }

    public createPacket(): ServerPacket | null {
        const packet = {
            tick: this.currentTick,
            data: {},
        } as ServerPacket;
        if (this.dirtyMaskMap.size === 0) {
            return null;
        }
        for (const [e, value] of this.dirtyMaskMap) {
            for (let i = 0; i < value.bits.length; i++) {
                const dirtyMask = value.bits[i];
                if (!dirtyMask) {
                    continue;
                }

                for (let j = 0; j < NetComponents.Count; j++) {
                    const mask = 1 << j;
                    if (dirtyMask & mask) {
                        const component = NetComponents[j];
                        const map = this.getMap(component! as ComponentType);
                        const componentData = map.get(e);
                        if (!componentData) {
                            console.error(
                                `Could not add dirty component to server packet: ${component} | component not found`,
                            );
                            continue;
                        }
                        if (!(e in packet.data)) {
                            packet.data[e] = {
                                mask: { bits: [...value.bits] },
                                components: [],
                            };
                        }
                        packet.data[e]!.components.push(componentData);
                    }
                }
            }
        }
        this.dirtyMaskMap.clear();
        return packet;
    }

    public createMask(e: Entity): Mask {
        const mask = { bits: new Uint32Array(BITS) };
        this.dirtyMaskMap.set(e, mask);
        return mask;
    }

    public setDirtyBit(e: Entity, component: ComponentType): Mask {
        const mask = this.dirtyMaskMap.get(e) ?? this.createMask(e);
        const bit = NetComponents[component as keyof typeof NetComponents];
        const index = Math.floor(bit / 32);
        mask.bits[index]! |= 1 << bit;
        this.dirtyMaskMap.set(e, mask);
        return mask;
    }

    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    override createComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootCreateComponent(e, component, value, this.currentTick);
        if (this.isNetComponent(component)) {
            this.setDirtyBit(e, component);
        }
    }

    override updateComponent<K extends ComponentType>(
        e: Entity,
        component: K,
        value: ComponentData<K>,
    ): void {
        this._rootUpdateComponent(e, component, value, this.currentTick);
        if (this.isNetComponent(component)) {
            this.setDirtyBit(e, component);
        }
    }

    public getState(): GameState {
        const state = {} as GameState;
        const keys = Object.keys(ComponentSchemas) as ComponentType[];

        keys.forEach(<K extends ComponentType>(key: K) => {
            const object = Object.fromEntries(this.getMap(key)) as Record<Entity, ComponentData<K>>;
            state[key] = object as GameState[typeof key];
        });

        return state;
    }

    // WORD = (id: NetComponents) => id >>> 5;
    // BIT  = (id: NetComponents) => 1 << (id & 31);
    // setPresence(mask: Mask, id: NetComponents): void {
    //     let object = mask.bits[this.WORD(id)]
    //     if(!object) { return }
    //   object |= this.BIT(id);
    // }
    // clearPresence(mask: Mask, id: NetComponents) {
    //   mask.bits[this.WORD(id)] &= ~this.BIT(id);
    // }
    // has(mask: Mask, id: NetComponents) {
    //   return (mask.bits[this.WORD(id)] & this.BIT(id)) !== 0;
    // }

    // setDirty(mask: Mask, id: NetComponents) {
    //   mask.bits[this.WORD(id)] |= this.BIT(id);
    // }
    // clearDirty(mask: Mask) {
    //   mask.bits.fill(0);
    // }
}
