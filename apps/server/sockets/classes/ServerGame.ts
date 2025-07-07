import { ComponentSchemas, Game, type ComponentData, type ComponentType, type Entity, type GameState } from '@monorepo/shared';
import { ServerGameSystems } from './ServerGameSystems';

export class ServerGame extends Game {
    systems: ServerGameSystems;
    // dirtyMask: Mask;
    private entityId = 0;

    constructor(data: GameState) {
        super(data);
        this.systems = new ServerGameSystems(this);
        // this.dirtyMask = { bits: new Uint32Array(BITS) }
    }

    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    override createComponent<K extends ComponentType>(e: Entity, component: K, value: ComponentData<K>): void {
        this._rootCreateComponent(e, component, value)
    }

    getState(): GameState {
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
