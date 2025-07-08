import { InputSystem } from '@monorepo/shared/systems';
import ClientGame from './ClientGame';
import InputManager from './inputManager';
import type { ComponentData, Entity, Radian } from '@monorepo/shared';

export default class ClientInputSystem extends InputSystem<ClientGame> {
    constructor(
        game: ClientGame,
        private inputManager: InputManager,
    ) {
        super(game);
    }

    override update(dt: number) {
        this.updateSnapshotQueue();
        this._rootUpdate(dt);
        //drain snapshot queue to update snapshot queue
        //set snapshots in server packet
        //run root update function to process snapshots
    }

    private updateSnapshotQueue() {
        const queue = this.inputManager.drain();
        if (queue.length === 0) {
            return [];
        }
        this.snapshots.set(this.game.player_entity, queue);
    }

    override handleRotation(entity: Entity, aim: Radian): void {
        const rotation = this.game.rotationMap.get(entity);
        if (rotation && rotation.rad !== aim) {
            this.game.justRotatedMap.set(entity, {});
        }
        this.game.rotationMap.set(entity, { rad: aim })
        return
    }
}
