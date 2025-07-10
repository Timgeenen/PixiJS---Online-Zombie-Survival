import { ComponentSchemas, Game, TICK, type ComponentData, type ComponentType, type Entity, type GameState, type ServerTickData } from '@monorepo/shared';
import { ServerGameSystems } from './ServerGameSystems';
import logger from '@Utils/logger';

export class ServerGame extends Game {
    // dirtyMask: Mask;
    private entityId = 0;
    private gameLoopRef: NodeJS.Timeout | null = null;
    public systems: ServerGameSystems;

    constructor(data: GameState) {
        super(data);
        this.systems = new ServerGameSystems(this);
        // this.dirtyMask = { bits: new Uint32Array(BITS) }
    }

    public startGameLoop(updateFn: (data: GameState) => void): ServerTickData {
        const data = this.getServerTickData()
        this.gameLoopRef = setInterval(() => {
            this.update(this.tickDt);
            const state = this.getState();
            updateFn(state);
        }, TICK * 1000);
        return data
    }

    public getServerTickData(): ServerTickData {
        return {
            serverTimeMs: Date.now(),
            tick: this.currentTick
        }
    }

    public update(dt: number): void {
        this.currentTick++
        this.systems.inputSystem.update(dt);
        this.systems.weaponSwitchSystem.update(dt)
        this.systems.reloadSystemA.update(dt);
        this.systems.fireControlSystem.update(dt);
        this.systems.ammoSystem.update(dt);
        this.systems.reloadSystemB.update(dt);
        this.systems.movementPredictSystem.update(dt)
        this.systems.movementCommitSystem.update(dt);
        this.systems.spawnSystem.update(dt);
    }


    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    override createComponent<K extends ComponentType>(e: Entity, component: K, value: ComponentData<K>): void {
        this._rootCreateComponent(e, component, value)
    }

    public getState(): GameState {
        const state = {} as GameState;
        const keys = Object.keys(ComponentSchemas) as ComponentType[];

        keys.forEach(<K extends ComponentType>(key: K) => {
            const object = Object.fromEntries(this.getMap(key)) as Record<Entity, ComponentData<K>>;
            state[key] = object as GameState[typeof key]
        })


        return state
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
