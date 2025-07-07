import { InputSystem } from '@monorepo/shared/systems';
import ClientGame from './ClientGame';
import InputManager from './inputManager';

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
}
